import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GameEngine } from '../src/core/gameEngine.ts';
import * as collisionModule from '../src/core/collision.ts';
import { LaneType, MoveDirection, WORLD_CONFIG } from '../src/core/types.ts';

const { findSupportingLog } = collisionModule;
const worldToScreenX = (collisionModule as Record<string, unknown>).worldToScreenX as
  | ((x: number) => number)
  | undefined;
const vehicleScreenRotationY = (collisionModule as Record<string, unknown>)
  .vehicleScreenRotationY as ((speed: number) => number) | undefined;

describe('Adversarial Bugfix Suite — Coordinate Sync, Log Hop Drift, Input Queue & Wrap Ring', () => {
  it('Bug 1 (Scene-Physics X-Axis Synchronization): worldToScreenX maps all entities identically so logs, trees, cars, and player never mirror-invert', () => {
    assert.equal(typeof worldToScreenX, 'function', 'worldToScreenX must be exported from collision.ts');
    assert.equal(worldToScreenX!(0), 0);
    assert.equal(worldToScreenX!(4), -4);
    assert.equal(worldToScreenX!(-3.5), 3.5);

    // Verify vehicle rotation matches inverted screen X axis
    assert.equal(typeof vehicleScreenRotationY, 'function');
    assert.notEqual(vehicleScreenRotationY!(3.0), vehicleScreenRotationY!(-3.0));

    // Verify SceneManager applies worldToScreenX to trees, vehicles, logs, and player
    const sceneManagerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/view/sceneManager.ts'),
      'utf8'
    );
    assert.equal(
      sceneManagerSrc.includes('worldToScreenX(treeX)'),
      true,
      'SceneManager must position trees using worldToScreenX(treeX)'
    );
    assert.equal(
      sceneManagerSrc.includes('worldToScreenX(v.x)'),
      true,
      'SceneManager must position vehicles using worldToScreenX(v.x)'
    );
    assert.equal(
      sceneManagerSrc.includes('worldToScreenX(log.x)'),
      true,
      'SceneManager must position logs using worldToScreenX(log.x)'
    );
  });

  it('Bug 2 (Tight Log Hitbox Margin): player cannot hover 0.30 tiles past physical log end over open water', () => {
    const log = { id: 1, x: 0, length: 3.0, speed: 2.0 };
    // Half-length is 1.5. At x = 1.80 (0.30 past edge), player must NOT be supported
    assert.equal(
      findSupportingLog(1.8, [log]),
      null,
      'Standing 0.30 tiles outside physical log end must not count as supported'
    );
    // At x = 1.58 (within 0.12 margin), player IS supported
    assert.notEqual(findSupportingLog(1.58, [log]), null);
  });

  it('Bug 3 (Log Drift During Hop Animation): hopping along a moving log preserves exact relative step (-1/+1) on the log without slipping', () => {
    const engine = new GameEngine(707);
    const riverLane = engine.getLane(1);
    riverLane.type = LaneType.RIVER;
    riverLane.obstacles = [];
    riverLane.vehicles = [];
    riverLane.logs = [{ id: 88, x: 0, length: 3.8, speed: 4.0 }];

    // First hop onto the log at (row=1, x=0)
    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    assert.equal(engine.getPlayer().row, 1);
    assert.equal(engine.getPlayer().isDead, false);

    const relBeforeHop = engine.getPlayer().x - riverLane.logs[0].x;

    // Now hop RIGHT (+1) along the same fast-moving log (speed = 4.0)
    engine.queueMove(MoveDirection.RIGHT);
    engine.step(WORLD_CONFIG.HOP_DURATION / 2);
    engine.step(WORLD_CONFIG.HOP_DURATION / 2 + 0.01);

    const p = engine.getPlayer();
    assert.equal(p.isDead, false, 'Player should stay on the log after stepping along it');
    const relAfterHop = p.x - riverLane.logs[0].x;
    assert.ok(
      Math.abs(relAfterHop - (relBeforeHop + 1)) < 1e-3,
      `Expected relative X on log to shift by exactly +1 (to ${relBeforeHop + 1}), but got ${relAfterHop}`
    );
  });

  it('Bug 4 (Input Queue Non-Stalling & Blocked Move Feedback): blocked move in queue does not stall subsequent valid move and returns false', () => {
    const engine = new GameEngine(808);
    const lane0 = engine.getLane(0);
    lane0.obstacles = [];
    const lane1 = engine.getLane(1);
    lane1.type = LaneType.GRASS;
    lane1.obstacles = [0]; // Tree directly ahead at (row=1, x=0)

    // Attempt blocked move when idle -> should return false (no hop started)
    const startedBlocked = engine.queueMove(MoveDirection.FORWARD);
    assert.equal(startedBlocked, false, 'queueMove should return false when move is blocked by a tree');
    assert.equal(engine.getPlayer().isHopping, false);

    // Start a valid move RIGHT to x=1, and while mid-hop queue a blocked FORWARD (if tree at (1,1)) + valid RIGHT (to x=2)
    lane1.obstacles = [0, 1];
    const startedValid = engine.queueMove(MoveDirection.RIGHT);
    assert.equal(startedValid, true, 'queueMove should return true when hop starts');

    // While hopping to (0, 1), buffer FORWARD (blocked by tree at (1,1)) and RIGHT (valid to (0,2))
    engine.queueMove(MoveDirection.FORWARD);
    engine.queueMove(MoveDirection.RIGHT);

    // Finish first hop -> engine should skip blocked FORWARD and immediately start valid RIGHT hop
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    assert.equal(
      engine.getPlayer().isHopping,
      true,
      'Engine must skip blocked queued move and immediately start the next valid queued move'
    );
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    assert.equal(engine.getPlayer().x, 2);
  });

  it('Bug 5 (Expanded Wrap Limit Outside Camera Frustum): WRAP_LIMIT is >= 22 so vehicles and logs do not pop in/out on 16:9 screens', () => {
    assert.ok(
      WORLD_CONFIG.WRAP_LIMIT >= 22,
      `Expected WORLD_CONFIG.WRAP_LIMIT >= 22, got ${WORLD_CONFIG.WRAP_LIMIT}`
    );
  });

  it('Bug 6 (Camera Grace Period 0.4s & Frustum Edge Threshold -0.98): triggers death shortly after crossing screen edge with smooth warning ratio', () => {
    assert.equal(WORLD_CONFIG.CAMERA_GRACE_PERIOD, 0.4, 'CAMERA_GRACE_PERIOD must be reduced to 0.4s');

    // Test frustum NDC threshold: snappy death shortly after crossing bottom edge
    const isBehind = collisionModule.isPlayerBehindCameraFrustum;
    assert.equal(typeof isBehind, 'function');

    // At camZ = 5, player at row 0, player is safely inside screen view
    assert.equal(isBehind(0, 0, 5), false);
    // At camZ = 8, player at row 0, player has crossed bottom visible edge (< -0.98)
    assert.equal(isBehind(0, 0, 8), true);

    // Verify engine warning ratio smooth ramp-up before crossing bottom edge
    const engine = new GameEngine(101);
    // At start, player is at row 0, camera at -1.0 -> safely on screen -> warning ratio = 0
    assert.equal(engine.getCameraGraceRatio(), 0);
  });

  it('Bug 7 (Adaptive Frustum Viewport & Clean Minimal Road Markings): sceneManager uses mobile-optimized adaptive frustum and eliminates center dashes & waterfall jitter', () => {
    const sceneManagerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/view/sceneManager.ts'),
      'utf8'
    );
    assert.ok(
      sceneManagerSrc.includes('getCameraFrustumDimensions'),
      'sceneManager.ts must use getCameraFrustumDimensions for synchronized frustum calculations'
    );
    assert.ok(
      sceneManagerSrc.includes('targetCamX') && sceneManagerSrc.includes('worldToScreenX'),
      'sceneManager.ts must implement horizontal camera tracking following player.x'
    );
    assert.ok(
      !sceneManagerSrc.includes('waterfallSplashes'),
      'sceneManager.ts must not contain waterfallSplashes per-frame scaling or tracking'
    );

    // Verify mathematical bounds for all key aspect ratios
    const testAspects = [16 / 9, 4 / 3, 1.0, 9 / 16, 9 / 19.5, 9 / 21];
    for (const aspect of testAspects) {
      const { viewHeight, halfWidth, bottom, top } = collisionModule.getCameraFrustumDimensions(aspect);

      // On mobile (aspect <= 9/16): viewHeight is in ~14-16 range
      if (aspect <= 9 / 16) {
        assert.ok(viewHeight >= 14 && viewHeight <= 16, `viewHeight must be 14-16 on mobile, got ${viewHeight}`);
      }

      // On desktop (16/9): wide view (viewHeight ~ 22, halfWidth >= 10.5 to fit [-9..9])
      if (aspect >= 16 / 9) {
        assert.ok(viewHeight >= 20 && viewHeight <= 22, `viewHeight must be ~22 on desktop, got ${viewHeight}`);
        assert.ok(halfWidth >= 10.5, `halfWidth must be >= 10.5 on desktop to fit [-9..9], got ${halfWidth}`);
      }

      // Player visual center (~ -0.44) sits comfortably at ~25-30% from the bottom edge
      const playerPosPercent = (-0.44 - bottom) / viewHeight;
      assert.ok(
        playerPosPercent >= 0.25 && playerPosPercent <= 0.30,
        `Player must be positioned at 25-30% from bottom edge, got ${(playerPosPercent * 100).toFixed(1)}%`
      );

      // Aspect ratio must be isotropic (no stretching distortion)
      assert.ok(Math.abs((halfWidth * 2) / viewHeight - aspect) < 1e-9);
      assert.equal(top - bottom, viewHeight);
    }

    const meshFactorySrc = fs.readFileSync(
      path.join(process.cwd(), 'src/view/meshFactory.ts'),
      'utf8'
    );
    assert.ok(
      !meshFactorySrc.includes('dashMat'),
      'meshFactory.ts must not contain yellow center dash markings'
    );
  });

  it('Bug 8 (Multi-Lane Road Divider Markings): MeshFactory creates dashed lane divider at z = 0.5 and SceneManager adds it for consecutive roads', () => {
    const meshFactorySrc = fs.readFileSync(
      path.join(process.cwd(), 'src/view/meshFactory.ts'),
      'utf8'
    );
    assert.ok(
      meshFactorySrc.includes('createLaneDivider(): THREE.Group'),
      'meshFactory.ts must declare createLaneDivider(): THREE.Group'
    );
    assert.ok(
      meshFactorySrc.includes('BoxGeometry(0.65, 0.02, 0.08)'),
      'createLaneDivider must create dashes with dimensions (0.65, 0.02, 0.08)'
    );
    assert.ok(
      meshFactorySrc.includes('dash.position.set(x, 0.015, 0.5)'),
      'createLaneDivider must place dashes at y=0.015 and z=0.5'
    );

    const sceneManagerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/view/sceneManager.ts'),
      'utf8'
    );
    assert.ok(
      sceneManagerSrc.includes('buildLaneGroup(lane: Lane, hasNextRoad: boolean = false)'),
      'sceneManager.ts must have buildLaneGroup accept hasNextRoad flag'
    );
    assert.ok(
      sceneManagerSrc.includes('MeshFactory.createLaneDivider()'),
      'sceneManager.ts must invoke MeshFactory.createLaneDivider() for consecutive road lanes'
    );
    assert.ok(
      sceneManagerSrc.includes('const nextLane = engine.getLane(lane.index + 1);'),
      'sceneManager.ts must query next lane type in sync()'
    );
  });

  it('Bug 9 (Leaderboard CSS Grid & Player Name Centering): build.mjs and uiManager use 3-column grid and dedicated column classes', () => {
    const buildSrc = fs.readFileSync(
      path.join(process.cwd(), 'scripts/build.mjs'),
      'utf8'
    );
    assert.ok(
      buildSrc.includes('grid-template-columns: 85px 1fr 95px;'),
      'scripts/build.mjs must configure .lb-row with 3-column CSS Grid (85px 1fr 95px)'
    );
    assert.ok(
      buildSrc.includes('.lb-col-rank { text-align: left; }'),
      'scripts/build.mjs must define .lb-col-rank'
    );
    assert.ok(
      buildSrc.includes('.lb-col-player { text-align: center;'),
      'scripts/build.mjs must define .lb-col-player centered'
    );
    assert.ok(
      buildSrc.includes('.lb-col-score { text-align: right;'),
      'scripts/build.mjs must define .lb-col-score right-aligned'
    );
    assert.ok(
      buildSrc.includes('<span class="lb-col-rank">Ранг</span>') &&
      buildSrc.includes('<span class="lb-col-player">Игрок</span>') &&
      buildSrc.includes('<span class="lb-col-score">Очки</span>'),
      'scripts/build.mjs leaderboard header must use column classes'
    );

    const uiManagerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/app/uiManager.ts'),
      'utf8'
    );
    assert.ok(
      uiManagerSrc.includes('<span class="lb-col-rank">'),
      'uiManager.ts must render rank in .lb-col-rank'
    );
    assert.ok(
      uiManagerSrc.includes('<span class="lb-col-player">'),
      'uiManager.ts must render player badge and name in .lb-col-player'
    );
    assert.ok(
      uiManagerSrc.includes('<span class="lb-col-score">'),
      'uiManager.ts must render score in .lb-col-score'
    );
  });
});
