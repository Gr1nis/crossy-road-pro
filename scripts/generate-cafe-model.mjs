import { callBlockbench } from './bb-client.mjs';
import fs from 'fs';
import { execSync } from 'child_process';

async function buildFlawlessMasterpieceCafe() {
  console.log('--- Step 1: Cleaning previous tabs and starting new project ---');
  await callBlockbench('execute_script', {
    code: `
      if (typeof ModelProject !== 'undefined' && ModelProject.all) {
        for (const p of [...ModelProject.all]) {
          p.close(true);
        }
      }
      return true;
    `
  });
  await callBlockbench('new_project', {
    format: 'free',
    name: 'cafe_townhouse',
    texture_width: 256,
    texture_height: 256
  });

  console.log('--- Step 2: Creating groups with proper rotation pivots ---');
  await callBlockbench('add_groups', {
    groups: [
      { name: 'Foundation', origin: [0, 0, 0] },
      { name: 'Ground_Floor', origin: [0, 0, 0] },
      { name: 'Second_Floor', origin: [0, 14, 0] },
      { name: 'Cornices', origin: [0, 0, 0] },
      { name: 'Shopfront_Entrance', origin: [0, 0, 0] },
      { name: 'Shopfront_Showcase', origin: [0, 0, 0] },
      { name: 'Awning_Front_Group', origin: [0, 9.8, -9.2], rotation: [20, 0, 0] },
      { name: 'Awning_Side_Group', origin: [11.0, 9.8, 0], rotation: [0, 0, 20] },
      { name: 'Roof_Structure', origin: [0, 27.8, 0] },
      { name: 'Dormers', origin: [0, 27.8, 0] },
      { name: 'Attic_Front_Window', origin: [0, 27.8, 0] },
      { name: 'Chimney_Pipe', origin: [0, 0, 0] },
      { name: 'Decorations', origin: [0, 0, 0] }
    ]
  });

  const cubes = [];

  // ==========================================
  // 1. FOUNDATION / PLINTH (Y: 0 to 1.8)
  // ==========================================
  cubes.push({ name: 'base_stone_front', parent: 'Foundation', from: [-11.4, 0, -9.4], to: [11.4, 1.8, -8.4] });
  cubes.push({ name: 'base_stone_left', parent: 'Foundation', from: [-11.4, 0, -8.4], to: [-10.4, 1.8, 9.4] });
  cubes.push({ name: 'base_stone_right', parent: 'Foundation', from: [10.4, 0, -8.4], to: [11.4, 1.8, 9.4] });
  cubes.push({ name: 'base_stone_back', parent: 'Foundation', from: [-10.4, 0, 8.4], to: [10.4, 1.8, 9.4] });

  // ==========================================
  // 2. GROUND FLOOR BLUE WALLS (Y: 1.8 to 13.8)
  // ==========================================
  cubes.push({ name: 'wall_blue_right_lower', parent: 'Ground_Floor', from: [10.5, 1.8, -9.0], to: [11.0, 3.2, 9.0] });
  cubes.push({ name: 'wall_blue_right_upper', parent: 'Ground_Floor', from: [10.5, 9.4, -9.0], to: [11.0, 13.8, 9.0] });
  cubes.push({ name: 'wall_blue_right_front_pillar', parent: 'Ground_Floor', from: [10.5, 3.2, -9.0], to: [11.0, 9.4, -4.6] });
  cubes.push({ name: 'wall_blue_right_rear_pillar', parent: 'Ground_Floor', from: [10.5, 3.2, 4.6], to: [11.0, 9.4, 9.0] });

  cubes.push({ name: 'wall_blue_left', parent: 'Ground_Floor', from: [-11.0, 1.8, -9.0], to: [-10.5, 13.8, 9.0] });
  cubes.push({ name: 'wall_blue_back', parent: 'Ground_Floor', from: [-10.5, 1.8, 8.5], to: [10.5, 13.8, 9.0] });

  cubes.push({ name: 'wall_blue_front_corner_left', parent: 'Ground_Floor', from: [-11.0, 1.8, -9.0], to: [-9.8, 13.8, -8.5] });
  cubes.push({ name: 'wall_blue_front_window_base', parent: 'Ground_Floor', from: [-9.8, 1.8, -9.0], to: [2.8, 3.0, -8.5] });
  cubes.push({ name: 'wall_blue_front_mid_pillar', parent: 'Ground_Floor', from: [2.8, 1.8, -9.0], to: [4.2, 13.8, -8.5] });
  cubes.push({ name: 'wall_blue_front_corner_right', parent: 'Ground_Floor', from: [9.4, 1.8, -9.0], to: [11.0, 13.8, -8.5] });
  cubes.push({ name: 'wall_blue_front_top_spandrel', parent: 'Ground_Floor', from: [-9.8, 9.4, -9.0], to: [9.8, 13.8, -8.5] });

  // ==========================================
  // 3. SHOPFRONT: ENTRANCE DOOR & SHOWCASE
  // ==========================================
  // Door on +X (X: 4.2 to 9.4, Y: 1.8 to 9.4)
  cubes.push({ name: 'door_wood_frame_left', parent: 'Shopfront_Entrance', from: [4.2, 1.8, -9.2], to: [4.8, 9.4, -8.7] });
  cubes.push({ name: 'door_wood_frame_right', parent: 'Shopfront_Entrance', from: [8.8, 1.8, -9.2], to: [9.4, 9.4, -8.7] });
  cubes.push({ name: 'door_wood_frame_top', parent: 'Shopfront_Entrance', from: [4.2, 8.8, -9.2], to: [9.4, 9.4, -8.7] });
  cubes.push({ name: 'door_wood_panel', parent: 'Shopfront_Entrance', from: [4.8, 1.8, -9.0], to: [8.8, 8.8, -8.7] });
  
  // Recessed door panel molding (филёнка)
  cubes.push({ name: 'door_wood_recess_border', parent: 'Shopfront_Entrance', from: [5.4, 2.2, -9.18], to: [8.2, 4.8, -8.9] });
  cubes.push({ name: 'door_wood_panel_recess', parent: 'Shopfront_Entrance', from: [5.7, 2.5, -9.15], to: [7.9, 4.5, -8.92] });

  // Top door window with vertical mullion
  cubes.push({ name: 'glow_yellow_door_window', parent: 'Shopfront_Entrance', from: [5.2, 5.2, -9.1], to: [8.4, 8.4, -8.6] });
  cubes.push({ name: 'door_wood_window_mullion', parent: 'Shopfront_Entrance', from: [6.7, 5.2, -9.2], to: [6.9, 8.4, -8.55] });
  cubes.push({ name: 'door_handle_gold', parent: 'Shopfront_Entrance', from: [4.6, 4.6, -9.35], to: [5.2, 5.4, -8.85] });

  // Showcase on -X (X: -9.8 to 2.8, Y: 3.0 to 9.4)
  cubes.push({ name: 'frame_white_showcase_outer', parent: 'Shopfront_Showcase', from: [-10.0, 3.0, -9.2], to: [2.8, 9.4, -8.7] });
  cubes.push({ name: 'glow_yellow_showcase_glass', parent: 'Shopfront_Showcase', from: [-9.4, 3.6, -9.35], to: [2.2, 8.8, -8.8] });

  // Side showcase on +X wall (Z: -4.6 to 4.6, Y: 3.2 to 9.4)
  cubes.push({ name: 'frame_white_side_window', parent: 'Shopfront_Showcase', from: [10.6, 3.2, -4.6], to: [11.25, 9.4, 4.6] });
  cubes.push({ name: 'glow_yellow_side_glass', parent: 'Shopfront_Showcase', from: [10.7, 3.7, -4.1], to: [11.35, 8.9, 4.1] });

  // Chalkboard Menu Sign: Mounted right next to entrance door on front wall (+X pillar)
  cubes.push({ name: 'sign_wood_menu_frame', parent: 'Decorations', from: [9.5, 5.4, -9.25], to: [10.9, 9.0, -8.9] });
  cubes.push({ name: 'menu_slate_board', parent: 'Decorations', from: [9.65, 5.6, -9.32], to: [10.75, 8.8, -8.85] });
  cubes.push({ name: 'menu_chalk_header', parent: 'Decorations', from: [9.75, 8.2, -9.38], to: [10.65, 8.6, -8.8] });
  cubes.push({ name: 'menu_chalk_line_1', parent: 'Decorations', from: [9.75, 7.5, -9.38], to: [10.55, 7.75, -8.8] });
  cubes.push({ name: 'menu_chalk_line_2', parent: 'Decorations', from: [9.75, 6.8, -9.38], to: [10.45, 7.05, -8.8] });
  cubes.push({ name: 'menu_chalk_line_3', parent: 'Decorations', from: [9.75, 6.1, -9.38], to: [10.55, 6.35, -8.8] });

  // =========================================================================
  // 4. AWNINGS (SCALLOPED BOTTOM FRINGES)
  // =========================================================================
  // Front Awning: group pivot [0, 9.8, -9.2], rotation [20, 0, 0]
  const frontAwningX0 = -10.2;
  const frontAwningX1 = 3.4;
  const frontStripes = 9;
  const frontStripeW = (frontAwningX1 - frontAwningX0) / frontStripes;
  for (let i = 0; i < frontStripes; i++) {
    const x0 = frontAwningX0 + i * frontStripeW;
    const x1 = x0 + frontStripeW;
    const isRed = i % 2 === 0;
    const name = isRed ? `awning_red_front_${i}` : `awning_white_front_${i}`;
    cubes.push({ name, parent: 'Awning_Front_Group', from: [x0, 9.2, -12.4], to: [x1, 9.8, -9.2] });
    const fringeY0 = isRed ? 7.7 : 8.1;
    cubes.push({
      name: isRed ? `awning_red_fringe_${i}` : `awning_white_fringe_${i}`,
      parent: 'Awning_Front_Group',
      from: [x0, fringeY0, -12.4],
      to: [x1, 9.2, -12.1]
    });
  }

  // Side Awning: group pivot [11.0, 9.8, 0], rotation [0, 0, 20]
  const sideAwningZ0 = -4.6;
  const sideAwningZ1 = 4.6;
  const sideStripes = 7;
  const sideStripeW = (sideAwningZ1 - sideAwningZ0) / sideStripes;
  for (let i = 0; i < sideStripes; i++) {
    const z0 = sideAwningZ0 + i * sideStripeW;
    const z1 = z0 + sideStripeW;
    const isRed = i % 2 === 0;
    const name = isRed ? `awning_red_side_${i}` : `awning_white_side_${i}`;
    cubes.push({ name, parent: 'Awning_Side_Group', from: [11.0, 9.2, z0], to: [14.2, 9.8, z1] });
    const fringeY0 = isRed ? 7.7 : 8.1;
    cubes.push({
      name: isRed ? `awning_red_side_fringe_${i}` : `awning_white_side_fringe_${i}`,
      parent: 'Awning_Side_Group',
      from: [13.9, fringeY0, z0],
      to: [14.2, 9.2, z1]
    });
  }

  // =========================================================================
  // 5. CAFE SIGNBOARD & CRISP 3D VOXEL LETTERS
  // =========================================================================
  cubes.push({ name: 'sign_wood_board', parent: 'Shopfront_Showcase', from: [-8.8, 10.5, -9.75], to: [1.8, 13.3, -9.2] });
  cubes.push({ name: 'sign_wood_border_top', parent: 'Shopfront_Showcase', from: [-9.0, 13.3, -9.85], to: [2.0, 13.6, -9.1] });
  cubes.push({ name: 'sign_wood_border_bottom', parent: 'Shopfront_Showcase', from: [-9.0, 10.2, -9.85], to: [2.0, 10.5, -9.1] });

  // White 3D voxel letters C-A-F-E standing 0.4 proud
  // 'C' (X: 0.8 down to -0.8)
  cubes.push({ name: 'letter_white_c_spine', parent: 'Shopfront_Showcase', from: [0.3, 11.0, -10.15], to: [0.8, 12.8, -9.75] });
  cubes.push({ name: 'letter_white_c_top', parent: 'Shopfront_Showcase', from: [-0.8, 12.3, -10.15], to: [0.8, 12.8, -9.75] });
  cubes.push({ name: 'letter_white_c_bot', parent: 'Shopfront_Showcase', from: [-0.8, 11.0, -10.15], to: [0.8, 11.5, -9.75] });

  // 'A' (X: -1.3 down to -2.7)
  cubes.push({ name: 'letter_white_a_left', parent: 'Shopfront_Showcase', from: [-1.7, 11.0, -10.15], to: [-1.3, 12.8, -9.75] });
  cubes.push({ name: 'letter_white_a_right', parent: 'Shopfront_Showcase', from: [-2.7, 11.0, -10.15], to: [-2.3, 12.8, -9.75] });
  cubes.push({ name: 'letter_white_a_top', parent: 'Shopfront_Showcase', from: [-2.7, 12.3, -10.15], to: [-1.3, 12.8, -9.75] });
  cubes.push({ name: 'letter_white_a_cross', parent: 'Shopfront_Showcase', from: [-2.7, 11.7, -10.15], to: [-1.3, 12.1, -9.75] });

  // 'F' (X: -3.2 down to -4.6)
  cubes.push({ name: 'letter_white_f_spine', parent: 'Shopfront_Showcase', from: [-3.6, 11.0, -10.15], to: [-3.2, 12.8, -9.75] });
  cubes.push({ name: 'letter_white_f_top', parent: 'Shopfront_Showcase', from: [-4.6, 12.3, -10.15], to: [-3.2, 12.8, -9.75] });
  cubes.push({ name: 'letter_white_f_mid', parent: 'Shopfront_Showcase', from: [-4.4, 11.7, -10.15], to: [-3.2, 12.1, -9.75] });

  // 'E' (X: -5.1 down to -6.5)
  cubes.push({ name: 'letter_white_e_spine', parent: 'Shopfront_Showcase', from: [-5.5, 11.0, -10.15], to: [-5.1, 12.8, -9.75] });
  cubes.push({ name: 'letter_white_e_top', parent: 'Shopfront_Showcase', from: [-6.5, 12.3, -10.15], to: [-5.1, 12.8, -9.75] });
  cubes.push({ name: 'letter_white_e_mid', parent: 'Shopfront_Showcase', from: [-6.3, 11.7, -10.15], to: [-5.1, 12.1, -9.75] });
  cubes.push({ name: 'letter_white_e_bot', parent: 'Shopfront_Showcase', from: [-6.5, 11.0, -10.15], to: [-5.1, 11.5, -9.75] });

  // =========================================================================
  // Hanging Coffee Sign on +X side wall (Rear-left position matching Panel 1 & 3)
  // Mounted near rear corner (Z ≈ 5.8) at middle cornice height (Y ≈ 12.2 to 16.0)
  // =========================================================================
  cubes.push({ name: 'pipe_grey_bracket', parent: 'Decorations', from: [11.0, 15.4, 5.6], to: [15.2, 16.0, 6.0] });
  // Dark wood outer frame around perimeter
  cubes.push({ name: 'sign_wood_frame_top', parent: 'Decorations', from: [12.0, 15.2, 5.5], to: [15.4, 15.6, 6.1] });
  cubes.push({ name: 'sign_wood_frame_bottom', parent: 'Decorations', from: [12.0, 12.2, 5.5], to: [15.4, 12.6, 6.1] });
  cubes.push({ name: 'sign_wood_frame_left', parent: 'Decorations', from: [12.0, 12.6, 5.5], to: [12.4, 15.2, 6.1] });
  cubes.push({ name: 'sign_wood_frame_right', parent: 'Decorations', from: [15.0, 12.6, 5.5], to: [15.4, 15.2, 6.1] });
  // White sign face (stands proud of center)
  cubes.push({ name: 'frame_white_hanging_face', parent: 'Decorations', from: [12.4, 12.6, 5.6], to: [15.0, 15.2, 6.0] });
  // Dark brown coffee cup, saucer, handle, and steam (standing 0.2 proud in Z)
  cubes.push({ name: 'cup_brown_saucer', parent: 'Decorations', from: [12.8, 12.85, 5.35], to: [14.6, 13.15, 6.25] });
  cubes.push({ name: 'cup_brown_body', parent: 'Decorations', from: [13.1, 13.15, 5.35], to: [14.3, 14.15, 6.25] });
  cubes.push({ name: 'cup_brown_handle', parent: 'Decorations', from: [14.3, 13.35, 5.4], to: [14.8, 13.95, 6.2] });
  cubes.push({ name: 'cup_brown_steam_1', parent: 'Decorations', from: [13.35, 14.35, 5.4], to: [13.55, 14.8, 6.2] });
  cubes.push({ name: 'cup_brown_steam_2', parent: 'Decorations', from: [13.85, 14.35, 5.4], to: [14.05, 14.8, 6.2] });

  // ==========================================
  // 6. MIDDLE CORNICE BELT (Y: 13.8 to 15.0)
  // ==========================================
  cubes.push({ name: 'cornice_white_mid_front', parent: 'Cornices', from: [-11.4, 13.8, -9.5], to: [11.4, 15.0, -8.5] });
  cubes.push({ name: 'cornice_white_mid_left', parent: 'Cornices', from: [-11.5, 13.8, -8.5], to: [-10.5, 15.0, 9.4] });
  cubes.push({ name: 'cornice_white_mid_right', parent: 'Cornices', from: [10.5, 13.8, -8.5], to: [11.5, 15.0, 9.4] });
  cubes.push({ name: 'cornice_white_mid_back', parent: 'Cornices', from: [-11.5, 13.8, 8.4], to: [11.5, 15.0, 9.5] });

  // ==========================================
  // 7. SECOND FLOOR WITH SASH CROSSES & COLORFUL FLOWERS
  // ==========================================
  cubes.push({ name: 'wall_blue_f2_left', parent: 'Second_Floor', from: [-11.0, 15.0, -9.0], to: [-10.5, 26.5, 9.0] });
  cubes.push({ name: 'wall_blue_f2_right', parent: 'Second_Floor', from: [10.5, 15.0, -9.0], to: [11.0, 26.5, 9.0] });
  cubes.push({ name: 'wall_blue_f2_back', parent: 'Second_Floor', from: [-10.5, 15.0, 8.5], to: [10.5, 26.5, 9.0] });
  cubes.push({ name: 'wall_blue_f2_front', parent: 'Second_Floor', from: [-10.5, 15.0, -8.8], to: [10.5, 26.5, -8.3] });

  // 3 Tall Windows on 2nd floor front
  const f2WinCenters = [-6.8, 0, 6.8];
  for (let i = 0; i < f2WinCenters.length; i++) {
    const cx = f2WinCenters[i];
    cubes.push({ name: `frame_white_f2_outer_${i}`, parent: 'Second_Floor', from: [cx - 2.2, 16.5, -9.35], to: [cx + 2.2, 23.8, -8.7] });
    cubes.push({ name: `glow_yellow_f2_win_${i}`, parent: 'Second_Floor', from: [cx - 1.6, 17.1, -9.45], to: [cx + 1.6, 23.2, -8.8] });
    cubes.push({ name: `frame_white_f2_mullion_v_${i}`, parent: 'Second_Floor', from: [cx - 0.2, 16.8, -9.52], to: [cx + 0.2, 23.5, -8.75] });
    cubes.push({ name: `frame_white_f2_mullion_h_${i}`, parent: 'Second_Floor', from: [cx - 1.8, 19.8, -9.52], to: [cx + 1.8, 20.3, -8.75] });

    // Planter box & lush shrub
    cubes.push({ name: `planter_wood_f2_${i}`, parent: 'Decorations', from: [cx - 2.5, 15.4, -10.1], to: [cx + 2.5, 16.6, -8.8] });
    cubes.push({ name: `plant_green_f2_${i}`, parent: 'Decorations', from: [cx - 2.3, 16.6, -10.0], to: [cx + 2.3, 17.4, -8.9] });

    // Multi-color flowers
    cubes.push({ name: `flower_pink_f2_${i}`, parent: 'Decorations', from: [cx - 1.6, 17.4, -9.8], to: [cx - 1.1, 18.0, -9.2] });
    cubes.push({ name: `flower_yellow_f2_${i}`, parent: 'Decorations', from: [cx - 0.3, 17.4, -9.7], to: [cx + 0.3, 18.1, -9.2] });
    cubes.push({ name: `flower_red_f2_${i}`, parent: 'Decorations', from: [cx + 1.0, 17.4, -9.8], to: [cx + 1.5, 18.0, -9.2] });
  }

  // TWO 2nd Floor Side Windows (+X wall)
  const sideWinCenters = [-2.8, 2.8];
  for (let s = 0; s < sideWinCenters.length; s++) {
    const cz = sideWinCenters[s];
    cubes.push({ name: `frame_white_side_f2_win_${s}`, parent: 'Second_Floor', from: [10.6, 16.5, cz - 1.8], to: [11.25, 23.8, cz + 1.8] });
    cubes.push({ name: `glow_yellow_side_f2_glass_${s}`, parent: 'Second_Floor', from: [10.7, 17.1, cz - 1.3], to: [11.35, 23.2, cz + 1.3] });
    cubes.push({ name: `frame_white_side_f2_mullion_v_${s}`, parent: 'Second_Floor', from: [10.75, 16.8, cz - 0.15], to: [11.42, 23.5, cz + 0.15] });
    cubes.push({ name: `frame_white_side_f2_mullion_h_${s}`, parent: 'Second_Floor', from: [10.75, 19.8, cz - 1.5], to: [11.42, 20.3, cz + 1.5] });
  }

  // Subtle brick reliefs (single voxel accents, 1x1 size)
  cubes.push({ name: 'wall_blue_brick_1', parent: 'Second_Floor', from: [-8.5, 24.5, -9.1], to: [-7.3, 25.3, -8.5] });
  cubes.push({ name: 'wall_blue_brick_2', parent: 'Second_Floor', from: [7.3, 24.5, -9.1], to: [8.5, 25.3, -8.5] });
  cubes.push({ name: 'wall_blue_brick_3', parent: 'Second_Floor', from: [3.4, 18.5, -9.1], to: [4.6, 19.3, -8.5] });
  cubes.push({ name: 'wall_blue_brick_side_1', parent: 'Ground_Floor', from: [10.6, 8.5, 5.5], to: [11.2, 9.3, 6.7] });
  cubes.push({ name: 'wall_blue_brick_side_2', parent: 'Second_Floor', from: [10.6, 19.5, 5.2], to: [11.2, 20.3, 6.4] });

  // ==========================================
  // 8. UPPER CORNICE / ROOF BASE (Y: 26.5 to 27.8)
  // ==========================================
  cubes.push({ name: 'cornice_white_top_front', parent: 'Cornices', from: [-11.6, 26.5, -9.6], to: [11.6, 27.8, -8.4] });
  cubes.push({ name: 'cornice_white_top_left', parent: 'Cornices', from: [-11.6, 26.5, -8.4], to: [-10.4, 27.8, 9.5] });
  cubes.push({ name: 'cornice_white_top_right', parent: 'Cornices', from: [10.4, 26.5, -8.4], to: [11.6, 27.8, 9.5] });
  cubes.push({ name: 'cornice_white_top_back', parent: 'Cornices', from: [-11.6, 26.5, 8.4], to: [11.6, 27.8, 9.6] });

  // =========================================================================
  // 9. REALIGNED ROOF STRUCTURE: FRONT & REAR GABLES, SIDE SLOPES
  // Matching Concept Art Panel 1 (Isometric) & Panel 3 (Front):
  // Front Facade (Z = -9.0) features triangular GABLE WALL with Attic Window.
  // Roof slopes down to the sides (-X and +X).
  // +X roof slope features TWO DORMER WINDOWS.
  // =========================================================================

  // Stepped Triangular Gable Walls (Front: Z: -9.0 to -8.5, Back: Z: 8.5 to 9.0)
  const gableSteps = [
    { y0: 27.8, y1: 29.6, xHalf: 10.2 },
    { y0: 29.5, y1: 31.4, xHalf: 8.4 },
    { y0: 31.3, y1: 33.2, xHalf: 6.6 },
    { y0: 33.1, y1: 35.0, xHalf: 4.8 },
    { y0: 34.9, y1: 36.8, xHalf: 3.0 },
    { y0: 36.7, y1: 38.4, xHalf: 1.2 }
  ];

  for (let g = 0; g < gableSteps.length; g++) {
    const s = gableSteps[g];
    cubes.push({ name: `wall_blue_gable_front_${g}`, parent: 'Roof_Structure', from: [-s.xHalf, s.y0, -9.0], to: [s.xHalf, s.y1, -8.5] });
    cubes.push({ name: `wall_blue_gable_rear_${g}`, parent: 'Roof_Structure', from: [-s.xHalf, s.y0, 8.5], to: [s.xHalf, s.y1, 9.0] });
  }

  // Subtle brick reliefs on front gable
  cubes.push({ name: 'wall_blue_brick_gable_1', parent: 'Roof_Structure', from: [-4.5, 32.5, -9.1], to: [-3.3, 33.3, -8.5] });
  cubes.push({ name: 'wall_blue_brick_gable_2', parent: 'Roof_Structure', from: [3.3, 32.5, -9.1], to: [4.5, 33.3, -8.5] });
  cubes.push({ name: 'wall_blue_brick_gable_3', parent: 'Roof_Structure', from: [-0.6, 28.8, -9.1], to: [0.6, 29.6, -8.5] });

  // Stepped Terracotta Roof Tiles: 6 steps per pitch + ridge cap
  // Overhanging front gable at Z = -10.0 and rear gable at Z = 10.0
  const tileSteps = [
    { step: 0, x0: 10.2, x1: 12.2, y0: 27.8, y1: 29.6 },
    { step: 1, x0: 8.4,  x1: 10.4, y0: 29.5, y1: 31.3 },
    { step: 2, x0: 6.6,  x1: 8.6,  y0: 31.2, y1: 33.0 },
    { step: 3, x0: 4.8,  x1: 6.8,  y0: 32.9, y1: 34.7 },
    { step: 4, x0: 3.0,  x1: 5.0,  y0: 34.6, y1: 36.4 },
    { step: 5, x0: 1.2,  x1: 3.2,  y0: 36.3, y1: 38.1 }
  ];

  for (const t of tileSteps) {
    // Right slope (+X)
    cubes.push({
      name: `roof_tile_right_step_${t.step}`,
      parent: 'Roof_Structure',
      from: [t.x0, t.y0, -10.0],
      to: [t.x1, t.y1, 10.0]
    });
    // Left slope (-X)
    cubes.push({
      name: `roof_tile_left_step_${t.step}`,
      parent: 'Roof_Structure',
      from: [-t.x1, t.y0, -10.0],
      to: [-t.x0, t.y1, 10.0]
    });
  }

  // Central Ridge Cap running along Z
  cubes.push({
    name: 'roof_ridge_cap',
    parent: 'Roof_Structure',
    from: [-1.4, 38.0, -10.2],
    to: [1.4, 39.5, 10.2]
  });

  // =========================================================================
  // 10. ATTIC WINDOW ON FRONT GABLE (Z = -9.0)
  // Non-coplanar depth layers: Frame outermost, mullions proud, glass recessed
  // =========================================================================
  cubes.push({ name: 'frame_white_attic', parent: 'Attic_Front_Window', from: [-1.8, 30.5, -9.35], to: [1.8, 35.0, -8.6] });
  cubes.push({ name: 'glow_yellow_attic', parent: 'Attic_Front_Window', from: [-1.3, 31.0, -9.45], to: [1.3, 34.5, -8.7] });
  cubes.push({ name: 'frame_white_attic_v', parent: 'Attic_Front_Window', from: [-0.15, 30.8, -9.52], to: [0.15, 34.7, -8.65] });
  cubes.push({ name: 'frame_white_attic_h', parent: 'Attic_Front_Window', from: [-1.5, 32.5, -9.52], to: [1.5, 33.0, -8.65] });

  // =========================================================================
  // 11. TWO DORMER WINDOWS ON +X ROOF SLOPE
  // Facing +X (towards side street), non-coplanar clean layers
  // =========================================================================
  const dormerZ = [-4.0, 4.0];
  for (let d = 0; d < dormerZ.length; d++) {
    const cz = dormerZ[d];
    // Warm caramel dormer body embedded in slope
    cubes.push({ name: `dormer_body_${d}`, parent: 'Dormers', from: [4.2, 30.6, cz - 1.6], to: [9.0, 34.4, cz + 1.6] });
    // White casing facing +X (casing backing at X: 9.35)
    cubes.push({ name: `frame_white_dormer_${d}`, parent: 'Dormers', from: [8.8, 30.8, cz - 1.4], to: [9.35, 34.2, cz + 1.4] });
    // Glowing glass (proud of casing at X: 9.45)
    cubes.push({ name: `glow_yellow_dormer_${d}`, parent: 'Dormers', from: [8.9, 31.2, cz - 1.1], to: [9.45, 33.8, cz + 1.1] });
    // Cross sash mullions (stands 0.07 proud of glass at X: 9.52)
    cubes.push({ name: `frame_white_dormer_mullion_v_${d}`, parent: 'Dormers', from: [8.95, 31.0, cz - 0.15], to: [9.52, 34.0, cz + 0.15] });
    cubes.push({ name: `frame_white_dormer_mullion_h_${d}`, parent: 'Dormers', from: [8.95, 32.3, cz - 1.25], to: [9.52, 32.7, cz + 1.25] });
    // Pitched terracotta roof cap
    cubes.push({ name: `roof_dormer_cap_lower_${d}`, parent: 'Dormers', from: [3.8, 34.2, cz - 1.9], to: [9.7, 35.1, cz + 1.9] });
    cubes.push({ name: `roof_dormer_cap_upper_${d}`, parent: 'Dormers', from: [3.8, 35.1, cz - 1.1], to: [9.7, 35.9, cz + 1.1] });
  }

  // =========================================================================
  // 12. CHIMNEY WITH STONE COLLAR, GREY SHAFT, CAP & POT + DOWNSPOUT PIPE
  // Symmetrically centered on ridge (X=0) at rear. ZERO blue wall on roof.
  // =========================================================================
  cubes.push({ name: 'chimney_stone_base', parent: 'Chimney_Pipe', from: [-1.6, 38.0, 5.6], to: [1.6, 39.8, 8.4] });
  cubes.push({ name: 'chimney_pipe_shaft', parent: 'Chimney_Pipe', from: [-1.2, 39.8, 6.0], to: [1.2, 44.8, 8.0] });
  cubes.push({ name: 'chimney_cap_stone', parent: 'Chimney_Pipe', from: [-1.6, 44.8, 5.6], to: [1.6, 45.8, 8.4] });
  cubes.push({ name: 'chimney_pot_dark', parent: 'Chimney_Pipe', from: [-0.6, 45.8, 6.5], to: [0.6, 47.2, 7.5] });

  // Vertical downspout on rear corner of +X side wall (outside cornices) with hopper head
  cubes.push({ name: 'pipe_grey_downspout', parent: 'Chimney_Pipe', from: [11.65, 1.8, 7.4], to: [12.25, 26.8, 8.0] });
  cubes.push({ name: 'pipe_grey_hopper', parent: 'Chimney_Pipe', from: [11.5, 26.8, 7.2], to: [12.4, 27.8, 8.2] });
  cubes.push({ name: 'pipe_grey_bracket_1', parent: 'Chimney_Pipe', from: [11.0, 7.5, 7.3], to: [12.35, 8.1, 8.1] });
  cubes.push({ name: 'pipe_grey_bracket_2', parent: 'Chimney_Pipe', from: [11.0, 19.5, 7.3], to: [12.35, 20.1, 8.1] });

  // =========================================================================
  // 13. STREET PROPS & STEPPED PYRAMIDAL BUSHES (Matching Reference Panel 1 & 3)
  // ZERO clipping: bush moved to cz = 4.6 (well clear of pipe at 7.4), pot clear of bench
  // =========================================================================
  cubes.push({ name: 'bench_wood_seat', parent: 'Decorations', from: [-7.0, 1.8, -12.0], to: [-0.5, 2.8, -10.0] });
  cubes.push({ name: 'bench_wood_leg_left', parent: 'Decorations', from: [-6.4, 0, -11.7], to: [-5.6, 1.8, -10.3] });
  cubes.push({ name: 'bench_wood_leg_right', parent: 'Decorations', from: [-1.9, 0, -11.7], to: [-1.1, 1.8, -10.3] });

  // 3 Stepped Potted Bushes (Zero intersection with pipe, bench, or chalkboard menu)
  const potPositions = [
    { name: 'pot_side_corner', cx: 12.0, cz: 4.6 },
    { name: 'pot_mid_entrance', cx: 3.6, cz: -10.6 },
    { name: 'pot_front_right', cx: -8.5, cz: -10.6 }
  ];

  for (let p = 0; p < potPositions.length; p++) {
    const { cx, cz } = potPositions[p];
    cubes.push({ name: `pot_clay_${p}`, parent: 'Decorations', from: [cx - 1.1, 0, cz - 1.1], to: [cx + 1.1, 1.8, cz + 1.1] });
    cubes.push({ name: `plant_green_bush_tier1_${p}`, parent: 'Decorations', from: [cx - 0.9, 1.8, cz - 0.9], to: [cx + 0.9, 3.4, cz + 0.9] });
    cubes.push({ name: `plant_green_bush_tier2_${p}`, parent: 'Decorations', from: [cx - 0.6, 3.4, cz - 0.6], to: [cx + 0.6, 4.6, cz + 0.6] });
    cubes.push({ name: `plant_green_bush_tier3_${p}`, parent: 'Decorations', from: [cx - 0.35, 4.6, cz - 0.35], to: [cx + 0.35, 5.3, cz + 0.35] });
  }

  console.log(`Adding ${cubes.length} cubes in batches...`);
  const batchSize = 30;
  for (let i = 0; i < cubes.length; i += batchSize) {
    const batch = cubes.slice(i, i + batchSize);
    console.log(`Sending batch ${Math.floor(i / batchSize) + 1} (${batch.length} cubes)...`);
    await callBlockbench('add_cubes', { cubes: batch });
  }

  console.log('--- Step 3: Setting project resolution & palette texture ---');
  await callBlockbench('execute_script', {
    code: 'Project.texture_width = 256; Project.texture_height = 256; return true;'
  });

  await callBlockbench('create_texture', {
    name: 'Townhouse_Palette',
    width: 256,
    height: 256,
    fill: '#2F78CF'
  });

  console.log('--- Step 4: Baking 16x16 Color Swatch Palette & Mapping All Faces ---');
  await callBlockbench('execute_script', {
    code: `
      const swatches = [
        { name: 'white', x: 0, y: 0, hex: '#FFFFFF' },
        { name: 'yellow_glow', x: 16, y: 0, hex: '#FEF08A' },
        { name: 'flower_pink', x: 32, y: 0, hex: '#F472B6' },
        { name: 'flower_yellow', x: 48, y: 0, hex: '#FCD34D' },
        { name: 'flower_red', x: 64, y: 0, hex: '#EF4444' },
        { name: 'plant_green', x: 80, y: 0, hex: '#22C55E' },
        { name: 'wood_dark', x: 96, y: 0, hex: '#5C3217' },
        { name: 'wood_recess', x: 112, y: 0, hex: '#3E1F0B' },
        { name: 'awning_red', x: 128, y: 0, hex: '#DC2626' },
        { name: 'roof_terracotta', x: 144, y: 0, hex: '#C2410C' },
        { name: 'pot_clay', x: 160, y: 0, hex: '#EA580C' },
        { name: 'slate_menu', x: 176, y: 0, hex: '#1E293B' },
        { name: 'chalk_white', x: 192, y: 0, hex: '#F1F5F9' },
        { name: 'gold_handle', x: 208, y: 0, hex: '#EAB308' },
        { name: 'stone_grey', x: 224, y: 0, hex: '#CBD5E1' },
        { name: 'pipe_grey', x: 240, y: 0, hex: '#64748B' },
        { name: 'wall_blue', x: 0, y: 16, hex: '#2F78CF' },
        { name: 'brick_blue', x: 16, y: 16, hex: '#2563EB' },
        { name: 'chimney_pot', x: 32, y: 16, hex: '#334155' },
        { name: 'dormer_caramel', x: 48, y: 16, hex: '#C27835' }
      ];

      const t = Texture.all[0];
      t.edit((canvas) => {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2F78CF';
        ctx.fillRect(0, 0, 256, 256);
        swatches.forEach(s => {
          ctx.fillStyle = s.hex;
          ctx.fillRect(s.x, s.y, 16, 16);
        });
      });

      function getSwatchForName(name) {
        if (/glow_yellow/i.test(name)) return swatches[1];
        if (/flower_pink/i.test(name)) return swatches[2];
        if (/flower_yellow/i.test(name)) return swatches[3];
        if (/flower_red/i.test(name)) return swatches[4];
        if (/plant_green/i.test(name)) return swatches[5];
        if (/panel_recess/i.test(name)) return swatches[7];
        if (/dormer_body/i.test(name)) return swatches[19];
        if (/cup_brown|door_wood|sign_wood|bench_wood|planter_wood/i.test(name)) return swatches[6];
        if (/awning_red/i.test(name)) return swatches[8];
        if (/roof|dormer_roof/i.test(name)) return swatches[9];
        if (/pot_clay/i.test(name)) return swatches[10];
        if (/menu_slate/i.test(name)) return swatches[11];
        if (/menu_chalk/i.test(name)) return swatches[12];
        if (/door_handle/i.test(name)) return swatches[13];
        if (/base_stone|plinth|stone_grey|chimney_cap|chimney_stone/i.test(name)) return swatches[14];
        if (/pipe_grey|chimney_pipe/i.test(name)) return swatches[15];
        if (/chimney_pot/i.test(name)) return swatches[18];
        if (/wall_blue_brick/i.test(name)) return swatches[17];
        if (/wall_blue|gable/i.test(name)) return swatches[16];
        if (/letter_white|cornice_white|frame_white|awning_white/i.test(name)) return swatches[0];
        return swatches[16];
      }

      Cube.all.forEach(c => {
        const s = getSwatchForName(c.name);
        c.box_uv = false;
        for (const f in c.faces) {
          c.faces[f].texture = t.uuid;
          c.faces[f].uv[0] = s.x + 2;
          c.faces[f].uv[1] = s.y + 2;
          c.faces[f].uv[2] = s.x + 14;
          c.faces[f].uv[3] = s.y + 14;
        }
        Canvas.updateUV(c, true);
      });

      Canvas.updateAllUVs();
      Canvas.updateAllFaces();
      Canvas.updateAll();
      return true;
    `
  });

  console.log('--- Step 5: Saving model project file ---');
  const modelPath = '/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/assets/models/cafe_townhouse.bbmodel';
  await callBlockbench('save_project', { path: modelPath });
  console.log('--- Model saved to', modelPath, '---');

  console.log('--- Step 6: Taking targeted verification screenshots of all areas ---');
  async function takeTargetShot(filename, target, pos, w = 1000, h = 900) {
    const data = await callBlockbench('execute_script', {
      code: `
        const prev = Preview.selected;
        prev.controls.target.set(${target[0]}, ${target[1]}, ${target[2]});
        prev.camera.position.set(${pos[0]}, ${pos[1]}, ${pos[2]});
        prev.controls.update();
        return new Promise(res => Screencam.screenshotPreview(prev, { width: ${w}, height: ${h} }, res));
      `
    });
    const p = '/Users/egorbelogubec/.gemini/antigravity/brain/c4c57069-d105-4cca-bf1f-b4e3ff560ae1/' + filename;
    fs.writeFileSync(p, Buffer.from(data.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
    console.log('Saved ' + p);
  }

  // 1. Overall Front-Right 45° Hero View
  await takeTargetShot('fixed_hero_iso_framed.png', [0, 23.5, 0], [48, 44, -48], 1000, 900);

  // 2. Overall Front View
  await takeTargetShot('fixed_hero_front_framed.png', [0, 23.5, 0], [0, 23.5, -64], 1000, 900);

  // 3. Overall Back View
  await takeTargetShot('fixed_hero_back_framed.png', [0, 23.5, 0], [0, 23.5, 64], 1000, 900);

  console.log('--- Step 7: Assembling Side-by-Side Comparison Composites ---');
  execSync('python3 scripts/make_side_by_side.py', { stdio: 'inherit' });
  console.log('--- Side-by-Side Composites Ready! ---');
}

buildFlawlessMasterpieceCafe().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
