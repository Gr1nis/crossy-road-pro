import { callBlockbench } from './bb-client.mjs';
import path from 'path';
import fs from 'fs';

async function buildMasterpieceBooks() {
  console.log('--- Step 1: Closing previous tabs and starting new project ---');
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
    name: 'books_townhouse',
    texture_width: 256,
    texture_height: 256
  });

  console.log('--- Step 2: Creating groups with proper hierarchy ---');
  await callBlockbench('add_groups', {
    groups: [
      { name: 'Foundation', origin: [0, 0, 0] },
      { name: 'Ground_Floor', origin: [0, 0, 0] },
      { name: 'Second_Floor', origin: [0, 14.8, 0] },
      { name: 'Shopfront_Entrance', origin: [0, 0, 0] },
      { name: 'Shopfront_Vitrine', origin: [0, 0, 0] },
      { name: 'Awning_Group', origin: [0, 9.6, -7.0] },
      { name: 'Bookstall_Street', origin: [0, 0, 0] },
      { name: 'Sign_Horizontal', origin: [0, 13.0, -7.0] },
      { name: 'Sign_Vertical_Blade', origin: [-8.5, 17.0, -5.6] },
      { name: 'Sign_Hanging_Cantilever', origin: [8.5, 8.0, -4.0] },
      { name: 'Roof_Structure', origin: [0, 22.8, 0] },
      { name: 'Chimney', origin: [-5.0, 25.0, 4.4] },
      { name: 'Drainpipe', origin: [7.4, 0, -6.8] }
    ]
  });

  const cubes = [];

  // =========================================================================
  // 1. FOUNDATION / PLINTH (Y: 0 to 1.6)
  // Warm brown stone plinth matching the autumnal Crossy Road palette
  // Width [-8.0, 8.0], Depth [-6.5, 6.5]
  // =========================================================================
  cubes.push({ name: 'plinth_stone_front', parent: 'Foundation', from: [-8.0, 0.0, -6.8], to: [8.0, 1.6, -6.4] });
  cubes.push({ name: 'plinth_stone_side_west', parent: 'Foundation', from: [-8.2, 0.0, -6.4], to: [-7.8, 1.6, 6.5] });
  cubes.push({ name: 'plinth_stone_side_east', parent: 'Foundation', from: [7.8, 0.0, -6.4], to: [8.2, 1.6, 6.5] });
  cubes.push({ name: 'plinth_stone_back', parent: 'Foundation', from: [-7.8, 0.0, 6.3], to: [7.8, 1.6, 6.6] });
  // Doorstep on +X side: X from 1.6 to 6.4
  cubes.push({ name: 'plinth_stone_doorstep', parent: 'Foundation', from: [1.6, 0.0, -7.3], to: [6.4, 0.4, -6.8] });

  // =========================================================================
  // 2. GROUND FLOOR GREEN MASONRY WALLS (Y: 1.6 to 14.8)
  // Solid, seamless masonry walls completely enclosing ground floor
  // =========================================================================
  cubes.push({ name: 'wall_green_1f_side_west', parent: 'Ground_Floor', from: [-8.1, 1.6, -6.4], to: [-7.8, 14.8, 6.4] });
  cubes.push({ name: 'wall_green_1f_side_east', parent: 'Ground_Floor', from: [7.8, 1.6, -6.4], to: [8.1, 14.8, 6.4] });
  cubes.push({ name: 'wall_green_1f_back', parent: 'Ground_Floor', from: [-7.8, 1.6, 6.2], to: [7.8, 14.8, 6.5] });
  // Front masonry piers
  cubes.push({ name: 'wall_green_1f_corner_door', parent: 'Ground_Floor', from: [6.4, 1.6, -6.5], to: [7.8, 11.6, -6.2] });
  cubes.push({ name: 'wall_green_1f_pier_mid', parent: 'Ground_Floor', from: [0.8, 1.6, -6.5], to: [1.6, 11.6, -6.2] });
  cubes.push({ name: 'wall_green_1f_corner_vitrine', parent: 'Ground_Floor', from: [-7.8, 1.6, -6.5], to: [-6.8, 11.6, -6.2] });
  // Green wall above door up to BOOKS sign
  cubes.push({ name: 'wall_green_1f_above_door', parent: 'Ground_Floor', from: [1.6, 9.2, -6.5], to: [6.4, 11.6, -6.2] });
  // Green wall above vitrine up to BOOKS sign
  cubes.push({ name: 'wall_green_1f_above_vitrine', parent: 'Ground_Floor', from: [-6.8, 10.0, -6.5], to: [0.8, 11.6, -6.2] });
  // Distinct E-louver ventilation grilles at base of side wall per concept art!
  cubes.push({ name: 'wall_vent_louver_1', parent: 'Ground_Floor', from: [-8.45, 2.0, -2.4], to: [-7.85, 2.8, -0.2] });
  cubes.push({ name: 'wall_vent_louver_2', parent: 'Ground_Floor', from: [-8.45, 2.0, 1.6], to: [-7.85, 2.8, 3.8] });

  // =========================================================================
  // 3. ENTRANCE DOORWAY (Y: 1.6 to 9.2)
  // Timber door with single large glowing yellow glass window & wood panel
  // 0 muntin bars -> 0 coplanar overlap!
  // =========================================================================
  cubes.push({ name: 'door_frame_stile_east', parent: 'Shopfront_Entrance', from: [5.8, 1.6, -6.85], to: [6.4, 9.2, -6.3] });
  cubes.push({ name: 'door_frame_stile_west', parent: 'Shopfront_Entrance', from: [1.6, 1.6, -6.85], to: [2.2, 9.2, -6.3] });
  cubes.push({ name: 'door_frame_lintel', parent: 'Shopfront_Entrance', from: [2.2, 8.8, -6.85], to: [5.8, 9.2, -6.3] });
  cubes.push({ name: 'door_panel_leaf', parent: 'Shopfront_Entrance', from: [2.2, 1.6, -6.65], to: [5.8, 8.8, -6.40] });
  // Warm glowing single window pane in top half of door
  cubes.push({ name: 'glow_yellow_door_glass', parent: 'Shopfront_Entrance', from: [2.6, 5.2, -6.78], to: [5.4, 8.4, -6.48] });
  // Recessed panel on lower half of door leaf
  cubes.push({ name: 'door_panel_recess', parent: 'Shopfront_Entrance', from: [2.6, 2.2, -6.80], to: [5.4, 4.8, -6.50] });
  // Brass handle knob
  cubes.push({ name: 'door_handle_brass', parent: 'Shopfront_Entrance', from: [2.4, 4.8, -7.00], to: [2.7, 5.4, -6.70] });

  // =========================================================================
  // 4. VITRINE WINDOW & GLOWING INTERIOR BOOKSHELVES (-X: -6.8 to 0.8)
  // Warm golden glow from within, slender colorful book volumes
  // =========================================================================
  cubes.push({ name: 'vitrine_wood_sill', parent: 'Shopfront_Vitrine', from: [-6.8, 1.6, -7.0], to: [0.8, 2.2, -6.3] });
  cubes.push({ name: 'vitrine_wood_lintel', parent: 'Shopfront_Vitrine', from: [-6.8, 9.2, -6.9], to: [0.75, 9.8, -6.3] });
  cubes.push({ name: 'vitrine_wood_stile_w', parent: 'Shopfront_Vitrine', from: [-6.8, 2.2, -6.9], to: [-6.2, 9.2, -6.3] });
  cubes.push({ name: 'vitrine_wood_stile_e', parent: 'Shopfront_Vitrine', from: [0.2, 2.2, -6.9], to: [0.8, 9.2, -6.3] });
  // Warm glowing interior back wall
  cubes.push({ name: 'glow_yellow_vitrine_interior', parent: 'Shopfront_Vitrine', from: [-6.2, 2.1, -6.2], to: [0.2, 9.2, -6.0] });
  // Interior shelves (lower & upper)
  cubes.push({ name: 'vitrine_wood_shelf_lower', parent: 'Shopfront_Vitrine', from: [-6.15, 2.3, -6.55], to: [0.15, 2.7, -6.1] });
  cubes.push({ name: 'vitrine_wood_shelf_upper', parent: 'Shopfront_Vitrine', from: [-6.15, 5.4, -6.55], to: [0.15, 5.8, -6.1] });
  // Upper shelf vibrant books prominently visible above street stall (slender volumes, varied heights)
  cubes.push({ name: 'book_wine_in_1', parent: 'Shopfront_Vitrine', from: [-5.8, 5.8, -6.5], to: [-4.8, 8.4, -6.15] });
  cubes.push({ name: 'book_navy_in_2', parent: 'Shopfront_Vitrine', from: [-4.6, 5.8, -6.5], to: [-3.5, 7.8, -6.15] });
  cubes.push({ name: 'book_amber_in_3', parent: 'Shopfront_Vitrine', from: [-3.3, 5.8, -6.5], to: [-2.2, 7.1, -6.15] });
  cubes.push({ name: 'book_green_in_4', parent: 'Shopfront_Vitrine', from: [-2.0, 5.8, -6.5], to: [-1.0, 8.2, -6.15] });
  cubes.push({ name: 'book_terracotta_in_5', parent: 'Shopfront_Vitrine', from: [-0.8, 5.8, -6.5], to: [0.0, 7.5, -6.15] });
  // Lower shelf books
  cubes.push({ name: 'book_navy_low_1', parent: 'Shopfront_Vitrine', from: [-5.6, 2.7, -6.5], to: [-4.4, 4.8, -6.15] });
  cubes.push({ name: 'book_terracotta_low_2', parent: 'Shopfront_Vitrine', from: [-4.1, 2.7, -6.5], to: [-2.8, 4.4, -6.15] });
  cubes.push({ name: 'book_amber_low_3', parent: 'Shopfront_Vitrine', from: [-2.4, 2.7, -6.5], to: [-0.8, 4.6, -6.15] });

  // =========================================================================
  // 5. STRIPED AWNING OVER VITRINE WITH SCALLOPED FRINGE TEETH
  // 5 alternating dark green & lime stripes with authentic scalloped edge
  // =========================================================================
  cubes.push({ name: 'awning_dark_stripe_1', parent: 'Awning_Group', from: [-7.0, 9.6, -8.6], to: [-5.44, 11.4, -6.5] });
  cubes.push({ name: 'awning_light_stripe_2', parent: 'Awning_Group', from: [-5.44, 9.6, -8.6], to: [-3.88, 11.4, -6.5] });
  cubes.push({ name: 'awning_dark_stripe_3', parent: 'Awning_Group', from: [-3.88, 9.6, -8.6], to: [-2.32, 11.4, -6.5] });
  cubes.push({ name: 'awning_light_stripe_4', parent: 'Awning_Group', from: [-2.32, 9.6, -8.6], to: [-0.76, 11.4, -6.5] });
  cubes.push({ name: 'awning_dark_stripe_5', parent: 'Awning_Group', from: [-0.76, 9.6, -8.6], to: [0.8, 11.4, -6.5] });
  // Scalloped fringe teeth hanging down creating beautiful cloth valance waves (NO flat blocking bar!)
  cubes.push({ name: 'awning_dark_tooth_1', parent: 'Awning_Group', from: [-6.8, 8.7, -8.8], to: [-5.6, 9.6, -8.45] });
  cubes.push({ name: 'awning_light_tooth_2', parent: 'Awning_Group', from: [-5.24, 8.7, -8.8], to: [-4.04, 9.6, -8.45] });
  cubes.push({ name: 'awning_dark_tooth_3', parent: 'Awning_Group', from: [-3.68, 8.7, -8.8], to: [-2.48, 9.6, -8.45] });
  cubes.push({ name: 'awning_light_tooth_4', parent: 'Awning_Group', from: [-2.12, 8.7, -8.8], to: [-0.92, 9.6, -8.45] });
  cubes.push({ name: 'awning_dark_tooth_5', parent: 'Awning_Group', from: [-0.56, 8.7, -8.8], to: [0.64, 9.6, -8.45] });

  // =========================================================================
  // 6. COMPACT STREET BOOKSTALL & TRUE TRIANGULAR A-FRAME CHALKBOARD EASEL
  // =========================================================================
  // Bookstall wooden frame
  cubes.push({ name: 'bookstall_wood_leg_w', parent: 'Bookstall_Street', from: [-5.2, 0.0, -8.4], to: [-4.7, 2.6, -7.6] });
  cubes.push({ name: 'bookstall_wood_leg_e', parent: 'Bookstall_Street', from: [-0.5, 0.0, -8.4], to: [0.0, 2.6, -7.6] });
  cubes.push({ name: 'bookstall_wood_shelf_low', parent: 'Bookstall_Street', from: [-4.7, 0.6, -8.3], to: [-0.5, 0.9, -7.7] });
  cubes.push({ name: 'bookstall_wood_shelf_top', parent: 'Bookstall_Street', from: [-4.7, 1.6, -8.3], to: [-0.5, 1.9, -7.7] });
  cubes.push({ name: 'bookstall_wood_backboard', parent: 'Bookstall_Street', from: [-4.7, 1.9, -7.8], to: [-0.5, 2.8, -7.5] });

  // Colorful books in street stall
  cubes.push({ name: 'book_wine_stall_1', parent: 'Bookstall_Street', from: [-4.5, 0.9, -8.2], to: [-3.2, 1.55, -7.8] });
  cubes.push({ name: 'book_amber_stall_2', parent: 'Bookstall_Street', from: [-2.9, 0.9, -8.2], to: [-1.4, 1.55, -7.8] });
  cubes.push({ name: 'book_terracotta_stall_3', parent: 'Bookstall_Street', from: [-4.5, 1.9, -8.2], to: [-3.4, 2.75, -7.8] });
  cubes.push({ name: 'book_green_stall_4', parent: 'Bookstall_Street', from: [-3.2, 1.9, -8.2], to: [-2.1, 2.75, -7.8] });
  cubes.push({ name: 'book_navy_stall_5', parent: 'Bookstall_Street', from: [-1.9, 1.9, -8.2], to: [-0.8, 2.65, -7.8] });

  // True Triangular A-Frame Chalkboard Easel (distinct open legs and triangular gap)
  cubes.push({ name: 'chalkboard_wood_leg_w', parent: 'Bookstall_Street', from: [-7.8, 0.0, -9.6], to: [-7.2, 3.0, -8.7] });
  cubes.push({ name: 'chalkboard_wood_leg_e', parent: 'Bookstall_Street', from: [-6.4, 0.0, -9.6], to: [-5.8, 3.0, -8.7] });
  cubes.push({ name: 'chalkboard_wood_hinge_top', parent: 'Bookstall_Street', from: [-7.65, 2.7, -9.45], to: [-5.95, 3.1, -8.85] });
  cubes.push({ name: 'chalkboard_dark_face', parent: 'Bookstall_Street', from: [-7.2, 0.8, -9.55], to: [-6.4, 2.7, -8.95] });
  cubes.push({ name: 'sign_lime_chalk_1', parent: 'Bookstall_Street', from: [-7.0, 2.0, -9.65], to: [-6.6, 2.25, -9.2] });
  cubes.push({ name: 'sign_lime_chalk_2', parent: 'Bookstall_Street', from: [-7.0, 1.3, -9.65], to: [-6.6, 1.55, -9.2] });

  // =========================================================================
  // 7. LEFT SIDE WALL HANGING CANTILEVER TRADE SIGN (+X SIDE)
  // =========================================================================
  cubes.push({ name: 'sign_wood_bracket', parent: 'Sign_Hanging_Cantilever', from: [8.0, 8.8, -4.8], to: [9.8, 9.3, -3.4] });
  cubes.push({ name: 'sign_wood_board', parent: 'Sign_Hanging_Cantilever', from: [8.6, 6.8, -4.6], to: [9.6, 8.8, -3.6] });
  cubes.push({ name: 'sign_gold_emblem', parent: 'Sign_Hanging_Cantilever', from: [8.55, 7.4, -4.4], to: [9.65, 8.3, -3.8] });

  // =========================================================================
  // 8. TEAL DRAINPIPE ON LEFT FRONT CORNER (+X FRONT CORNER)
  // =========================================================================
  cubes.push({ name: 'drainpipe_hopper', parent: 'Drainpipe', from: [7.05, 22.0, -7.1], to: [7.7, 23.0, -6.5] });
  cubes.push({ name: 'drainpipe_pipe_body', parent: 'Drainpipe', from: [7.2, 1.0, -7.0], to: [7.55, 22.0, -6.6] });
  cubes.push({ name: 'drainpipe_electric_box', parent: 'Drainpipe', from: [6.85, 9.6, -7.2], to: [7.35, 10.75, -6.65] });
  cubes.push({ name: 'drainpipe_bracket', parent: 'Drainpipe', from: [7.15, 11.0, -7.05], to: [7.6, 11.4, -6.55] });
  cubes.push({ name: 'drainpipe_shoe', parent: 'Drainpipe', from: [7.2, 0.2, -7.4], to: [7.55, 1.0, -6.6] });

  // =========================================================================
  // 9. HORIZONTAL "BOOKS" SIGN (Y: 11.6 to 14.8, Z: -7.0 to -6.4)
  // Warm golden honey typography (#E5C158) per authentic vintage concept art!
  // =========================================================================
  cubes.push({ name: 'sign_bg_dark_board', parent: 'Sign_Horizontal', from: [-6.8, 11.8, -6.9], to: [6.8, 14.6, -6.4] });
  cubes.push({ name: 'sign_wood_border_top', parent: 'Sign_Horizontal', from: [-7.0, 14.4, -7.0], to: [7.0, 14.8, -6.3] });
  cubes.push({ name: 'sign_wood_border_bot', parent: 'Sign_Horizontal', from: [-7.0, 11.6, -7.0], to: [7.0, 12.0, -6.3] });
  cubes.push({ name: 'sign_wood_border_east', parent: 'Sign_Horizontal', from: [6.6, 12.0, -7.0], to: [7.0, 14.4, -6.3] });
  cubes.push({ name: 'sign_wood_border_west', parent: 'Sign_Horizontal', from: [-7.0, 12.0, -7.0], to: [-6.6, 14.4, -6.3] });

  // Letter 'B' (+X side: X: 3.8 to 5.4, Y: 12.2 to 14.2)
  cubes.push({ name: 'sign_lime_B_stem', parent: 'Sign_Horizontal', from: [5.0, 12.2, -7.15], to: [5.4, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_B_bar_top', parent: 'Sign_Horizontal', from: [4.1, 13.8, -7.15], to: [5.0, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_B_bar_mid', parent: 'Sign_Horizontal', from: [4.1, 13.0, -7.15], to: [5.0, 13.4, -6.85] });
  cubes.push({ name: 'sign_lime_B_bar_bot', parent: 'Sign_Horizontal', from: [4.1, 12.2, -7.15], to: [5.0, 12.6, -6.85] });
  cubes.push({ name: 'sign_lime_B_loop_top', parent: 'Sign_Horizontal', from: [3.8, 13.3, -7.15], to: [4.1, 14.0, -6.85] });
  cubes.push({ name: 'sign_lime_B_loop_bot', parent: 'Sign_Horizontal', from: [3.8, 12.4, -7.15], to: [4.1, 13.1, -6.85] });

  // Letter 'O1' (X: 1.6 to 3.2)
  cubes.push({ name: 'sign_lime_O1_stem_r', parent: 'Sign_Horizontal', from: [2.8, 12.2, -7.15], to: [3.2, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_O1_stem_in', parent: 'Sign_Horizontal', from: [1.6, 12.2, -7.15], to: [2.0, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_O1_bar_top', parent: 'Sign_Horizontal', from: [2.0, 13.8, -7.15], to: [2.8, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_O1_bar_bot', parent: 'Sign_Horizontal', from: [2.0, 12.2, -7.15], to: [2.8, 12.6, -6.85] });

  // Letter 'O2' (X: -0.6 to 1.0)
  cubes.push({ name: 'sign_lime_O2_stem_r', parent: 'Sign_Horizontal', from: [0.6, 12.2, -7.15], to: [1.0, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_O2_stem_l', parent: 'Sign_Horizontal', from: [-0.6, 12.2, -7.15], to: [-0.2, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_O2_bar_top', parent: 'Sign_Horizontal', from: [-0.2, 13.8, -7.15], to: [0.6, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_O2_bar_bot', parent: 'Sign_Horizontal', from: [-0.2, 12.2, -7.15], to: [0.6, 12.6, -6.85] });

  // Letter 'K' (X: -2.8 to -1.2)
  cubes.push({ name: 'sign_lime_K_stem', parent: 'Sign_Horizontal', from: [-1.6, 12.2, -7.15], to: [-1.2, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_K_mid', parent: 'Sign_Horizontal', from: [-2.1, 13.0, -7.15], to: [-1.6, 13.4, -6.85] });
  cubes.push({ name: 'sign_lime_K_arm', parent: 'Sign_Horizontal', from: [-2.8, 13.4, -7.15], to: [-2.1, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_K_leg', parent: 'Sign_Horizontal', from: [-2.8, 12.2, -7.15], to: [-2.1, 13.0, -6.85] });

  // Letter 'S' (-X side: X: -5.0 to -3.4, balanced friendly pixel typography)
  cubes.push({ name: 'sign_lime_S_bar_top', parent: 'Sign_Horizontal', from: [-5.0, 13.8, -7.15], to: [-3.4, 14.2, -6.85] });
  cubes.push({ name: 'sign_lime_S_spine_up', parent: 'Sign_Horizontal', from: [-3.8, 13.2, -7.15], to: [-3.4, 13.8, -6.85] });
  cubes.push({ name: 'sign_lime_S_bar_mid', parent: 'Sign_Horizontal', from: [-5.0, 13.0, -7.15], to: [-3.8, 13.4, -6.85] });
  cubes.push({ name: 'sign_lime_S_spine_low', parent: 'Sign_Horizontal', from: [-5.0, 12.6, -7.15], to: [-4.6, 13.0, -6.85] });
  cubes.push({ name: 'sign_lime_S_bar_bot', parent: 'Sign_Horizontal', from: [-4.6, 12.2, -7.15], to: [-3.4, 12.6, -6.85] });

  // =========================================================================
  // 10. SECOND FLOOR WALLS & BELT COURSE (Y: 14.8 to 22.8)
  // Perfectly proportioned, cozy facade aspect ratio ~1:1.5
  // =========================================================================
  cubes.push({ name: 'wall_green_2f_side_west', parent: 'Second_Floor', from: [-8.1, 14.8, -6.4], to: [-7.8, 22.8, 6.4] });
  cubes.push({ name: 'wall_green_2f_side_east', parent: 'Second_Floor', from: [7.8, 14.8, -6.4], to: [8.1, 22.8, 6.4] });
  cubes.push({ name: 'wall_green_2f_back', parent: 'Second_Floor', from: [-7.8, 14.8, 6.2], to: [7.8, 22.8, 6.5] });

  // Side belt courses dividing floors
  cubes.push({ name: 'cornice_cream_side_belt_west', parent: 'Second_Floor', from: [-8.4, 14.8, -6.5], to: [-8.15, 15.3, 6.5] });
  cubes.push({ name: 'cornice_cream_side_belt_east', parent: 'Second_Floor', from: [8.1, 14.8, -6.5], to: [8.4, 15.3, 6.5] });

  // Front wall piers and spandrels:
  // Upper spandrel from Y: 20.6 to 22.8 provides generous 2.2 units green wall above windows!
  cubes.push({ name: 'wall_green_2f_lower_spandrel', parent: 'Second_Floor', from: [-7.8, 14.8, -6.5], to: [7.8, 15.6, -6.2] });
  cubes.push({ name: 'wall_green_2f_top_spandrel', parent: 'Second_Floor', from: [-7.8, 20.6, -6.5], to: [7.8, 22.8, -6.2] });
  cubes.push({ name: 'wall_green_2f_corner_east', parent: 'Second_Floor', from: [6.6, 16.2, -6.5], to: [7.8, 20.6, -6.2] });
  cubes.push({ name: 'wall_green_2f_pier_1_2', parent: 'Second_Floor', from: [1.8, 16.2, -6.5], to: [2.6, 20.6, -6.2] });
  cubes.push({ name: 'wall_green_2f_pier_2_3', parent: 'Second_Floor', from: [-2.6, 16.2, -6.5], to: [-1.8, 20.6, -6.2] });
  cubes.push({ name: 'wall_green_2f_corner_west', parent: 'Second_Floor', from: [-7.8, 16.2, -6.5], to: [-6.6, 20.6, -6.2] });

  // =========================================================================
  // 11. FRONT 2ND FLOOR WINDOWS (3 COZY SQUAT WINDOWS, Y: 15.6 to 20.6)
  // =========================================================================
  // 11. FRONT 2ND FLOOR WINDOWS (3 CLEAN ELEGANT WINDOWS, Y: 15.6 to 20.6)
  // Single horizontal transom dividing upper and lower glowing panes (NO MULLIONS)
  // Crisp white frames, protruding white sills (+1.5 voxels forward to Z=-7.1)
  // =========================================================================
  // Window 1 (+X side, left in render: X: 2.6 to 6.6)
  cubes.push({ name: 'sill_white_w1', parent: 'Second_Floor', from: [2.3, 15.6, -7.1], to: [6.9, 16.2, -6.3] });
  cubes.push({ name: 'frame_white_w1_lintel', parent: 'Second_Floor', from: [2.6, 20.0, -6.75], to: [6.6, 20.6, -6.35] });
  cubes.push({ name: 'frame_white_w1_stile_outer', parent: 'Second_Floor', from: [6.0, 16.2, -6.75], to: [6.6, 20.0, -6.35] });
  cubes.push({ name: 'frame_white_w1_stile_inner', parent: 'Second_Floor', from: [2.6, 16.2, -6.75], to: [3.2, 20.0, -6.35] });
  cubes.push({ name: 'glow_yellow_w1_glass', parent: 'Second_Floor', from: [3.2, 16.2, -6.6], to: [6.0, 20.0, -6.3] });
  cubes.push({ name: 'frame_white_w1_transom', parent: 'Second_Floor', from: [3.1, 17.9, -6.7], to: [6.1, 18.3, -6.45] });

  // Window 2 (Center window: X: -1.8 to 1.8)
  cubes.push({ name: 'sill_white_w2', parent: 'Second_Floor', from: [-2.1, 15.6, -7.1], to: [2.1, 16.2, -6.3] });
  cubes.push({ name: 'frame_white_w2_lintel', parent: 'Second_Floor', from: [-1.8, 20.0, -6.75], to: [1.8, 20.6, -6.35] });
  cubes.push({ name: 'frame_white_w2_stile_east', parent: 'Second_Floor', from: [1.2, 16.2, -6.75], to: [1.8, 20.0, -6.35] });
  cubes.push({ name: 'frame_white_w2_stile_west', parent: 'Second_Floor', from: [-1.8, 16.2, -6.75], to: [-1.2, 20.0, -6.35] });
  cubes.push({ name: 'glow_yellow_w2_glass', parent: 'Second_Floor', from: [-1.2, 16.2, -6.6], to: [1.2, 20.0, -6.3] });
  cubes.push({ name: 'frame_white_w2_transom', parent: 'Second_Floor', from: [-1.3, 17.9, -6.7], to: [1.3, 18.3, -6.45] });

  // Window 3 (-X side, right in render: X: -6.6 to -2.6)
  cubes.push({ name: 'sill_white_w3', parent: 'Second_Floor', from: [-6.9, 15.6, -7.1], to: [-2.3, 16.2, -6.3] });
  cubes.push({ name: 'frame_white_w3_lintel', parent: 'Second_Floor', from: [-6.6, 20.0, -6.75], to: [-2.6, 20.6, -6.35] });
  cubes.push({ name: 'frame_white_w3_stile_inner', parent: 'Second_Floor', from: [-3.2, 16.2, -6.75], to: [-2.6, 20.0, -6.35] });
  cubes.push({ name: 'frame_white_w3_stile_outer', parent: 'Second_Floor', from: [-6.6, 16.2, -6.75], to: [-6.0, 20.0, -6.35] });
  cubes.push({ name: 'glow_yellow_w3_glass', parent: 'Second_Floor', from: [-6.0, 16.2, -6.6], to: [-3.2, 20.0, -6.3] });
  cubes.push({ name: 'frame_white_w3_transom', parent: 'Second_Floor', from: [-6.1, 17.9, -6.7], to: [-3.1, 18.3, -6.45] });

  // =========================================================================
  // 12. RIGHT SIDE WALL (-X SIDE) — EXACTLY ONE WINDOW & VERTICAL BLADE SIGN
  // Exactly 1 window positioned towards rear (Z in [0.8, 3.8]) per concept art!
  // Crisp white frames, RADIANT WARM GLOWING YELLOW GLASS visible from outside!
  // =========================================================================
  cubes.push({ name: 'sill_white_side_w', parent: 'Second_Floor', from: [-8.6, 15.6, 0.6], to: [-7.65, 16.2, 3.8] });
  cubes.push({ name: 'frame_white_side_lintel', parent: 'Second_Floor', from: [-8.5, 20.0, 0.8], to: [-7.65, 20.6, 3.6] });
  cubes.push({ name: 'frame_white_side_stile_front', parent: 'Second_Floor', from: [-8.5, 16.2, 0.8], to: [-7.65, 20.0, 1.4] });
  cubes.push({ name: 'frame_white_side_stile_rear', parent: 'Second_Floor', from: [-8.5, 16.2, 3.0], to: [-7.65, 20.0, 3.6] });
  cubes.push({ name: 'glow_yellow_side_glass', parent: 'Second_Floor', from: [-8.45, 16.2, 1.4], to: [-7.7, 20.0, 3.0] });
  cubes.push({ name: 'frame_white_side_transom', parent: 'Second_Floor', from: [-8.52, 17.9, 1.35], to: [-7.65, 18.3, 3.05] });

  // Vertical corner blade sign "BOOKS" mounted on right front corner (-X wall)
  cubes.push({ name: 'sign_blade_bracket_top', parent: 'Sign_Vertical_Blade', from: [-9.0, 20.35, -6.3], to: [-7.85, 20.75, -5.9] });
  cubes.push({ name: 'sign_blade_bracket_bot', parent: 'Sign_Vertical_Blade', from: [-9.0, 15.05, -6.3], to: [-7.85, 15.45, -5.9] });
  cubes.push({ name: 'sign_blade_board', parent: 'Sign_Vertical_Blade', from: [-8.65, 14.9, -6.2], to: [-8.25, 20.9, -4.6] });
  // 5 discrete honey-gold pixel letters B-O-O-K-S protruding 0.1 on sides
  cubes.push({ name: 'sign_blade_letter_B', parent: 'Sign_Vertical_Blade', from: [-8.75, 19.9, -5.8], to: [-8.15, 20.6, -5.0] });
  cubes.push({ name: 'sign_blade_letter_O1', parent: 'Sign_Vertical_Blade', from: [-8.75, 18.9, -5.8], to: [-8.15, 19.6, -5.0] });
  cubes.push({ name: 'sign_blade_letter_O2', parent: 'Sign_Vertical_Blade', from: [-8.75, 17.9, -5.8], to: [-8.15, 18.6, -5.0] });
  cubes.push({ name: 'sign_blade_letter_K', parent: 'Sign_Vertical_Blade', from: [-8.75, 16.9, -5.8], to: [-8.15, 17.6, -5.0] });
  cubes.push({ name: 'sign_blade_letter_S', parent: 'Sign_Vertical_Blade', from: [-8.75, 15.9, -5.8], to: [-8.15, 16.6, -5.0] });

  // Masonry accent bricks
  cubes.push({ name: 'brick_accent_side_1', parent: 'Second_Floor', from: [-8.25, 21.0, 4.2], to: [-7.95, 21.8, 5.6] });
  cubes.push({ name: 'brick_accent_front_1', parent: 'Second_Floor', from: [6.8, 21.0, -6.6], to: [7.4, 21.8, -6.4] });

  // =========================================================================
  // 13. TALL STEEP TERRACOTTA GABLE ROOF (Y: 22.8 to 29.1)
  // Continuous white cornice all around; uninterrupted stepped terracotta roof!
  // ZERO front parapet, zero side wall ears sticking up!
  // =========================================================================
  cubes.push({ name: 'cornice_cream_top_front', parent: 'Roof_Structure', from: [-8.4, 22.8, -6.8], to: [8.4, 23.3, -6.3] });
  cubes.push({ name: 'cornice_cream_top_back', parent: 'Roof_Structure', from: [-8.4, 22.8, 6.3], to: [8.4, 23.3, 6.8] });
  cubes.push({ name: 'cornice_cream_top_side_west', parent: 'Roof_Structure', from: [-8.35, 22.75, -6.3], to: [-8.1, 23.25, 6.3] });
  cubes.push({ name: 'cornice_cream_top_side_east', parent: 'Roof_Structure', from: [8.1, 22.75, -6.3], to: [8.35, 23.25, 6.3] });

  // West side gable wall (rising from Y=22.8 up into the roof slope to close open attic void)
  cubes.push({ name: 'gable_wall_west_low', parent: 'Roof_Structure', from: [-8.1, 22.8, -4.3], to: [-7.8, 24.65, 2.5] });
  cubes.push({ name: 'gable_wall_west_mid', parent: 'Roof_Structure', from: [-8.1, 24.65, -3.2], to: [-7.8, 26.45, 1.8] });
  cubes.push({ name: 'gable_wall_west_high', parent: 'Roof_Structure', from: [-8.1, 26.45, -1.8], to: [-7.8, 28.4, 1.0] });

  // East side gable wall (rising from Y=22.8 up into the roof slope to close open attic void)
  cubes.push({ name: 'gable_wall_east_low', parent: 'Roof_Structure', from: [7.8, 22.8, -4.3], to: [8.1, 24.65, 4.4] });
  cubes.push({ name: 'gable_wall_east_mid', parent: 'Roof_Structure', from: [7.8, 24.65, -3.2], to: [8.1, 26.45, 2.5] });
  cubes.push({ name: 'gable_wall_east_high', parent: 'Roof_Structure', from: [7.8, 26.45, -1.8], to: [8.1, 28.4, 1.2] });

  // 6 Continuous Stepped Rows on Front Roof Slope (overhanging side walls by 0.45 on each side!)
  cubes.push({ name: 'roof_terracotta_f_row_1', parent: 'Roof_Structure', from: [-8.55, 23.0, -6.5], to: [8.55, 24.0, -5.4] });
  cubes.push({ name: 'roof_terracotta_f_row_2', parent: 'Roof_Structure', from: [-8.55, 23.9, -5.45], to: [8.55, 24.9, -4.35] });
  cubes.push({ name: 'roof_terracotta_f_row_3', parent: 'Roof_Structure', from: [-8.55, 24.8, -4.4], to: [8.55, 25.8, -3.3] });
  cubes.push({ name: 'roof_terracotta_f_row_4', parent: 'Roof_Structure', from: [-8.55, 25.7, -3.35], to: [8.55, 26.7, -2.25] });
  cubes.push({ name: 'roof_terracotta_f_row_5', parent: 'Roof_Structure', from: [-8.55, 26.6, -2.3], to: [8.55, 27.6, -1.2] });
  cubes.push({ name: 'roof_terracotta_f_row_6', parent: 'Roof_Structure', from: [-8.55, 27.5, -1.25], to: [8.55, 28.5, 0.1] });

  // Ridge capping tile along peak
  cubes.push({ name: 'roof_terracotta_ridge_cap', parent: 'Roof_Structure', from: [-8.4, 28.4, -0.4], to: [8.4, 29.1, 0.4] });

  // Physical tile ribs on front slope creating authentic stepped tile relief
  cubes.push({ name: 'roof_rib_f_1', parent: 'Roof_Structure', from: [-6.2, 23.1, -6.7], to: [-5.0, 24.05, -5.3] });
  cubes.push({ name: 'roof_rib_f_2', parent: 'Roof_Structure', from: [-2.2, 23.1, -6.7], to: [-1.0, 24.05, -5.3] });
  cubes.push({ name: 'roof_rib_f_3', parent: 'Roof_Structure', from: [1.0, 23.1, -6.7], to: [2.2, 24.05, -5.3] });
  cubes.push({ name: 'roof_rib_f_4', parent: 'Roof_Structure', from: [5.0, 23.1, -6.7], to: [6.2, 24.05, -5.3] });

  // Rear Roof Slope (descending cleanly east of chimney)
  cubes.push({ name: 'roof_terracotta_rear_row_1', parent: 'Roof_Structure', from: [-8.55, 27.5, 0.0], to: [8.55, 28.5, 1.3] });
  cubes.push({ name: 'roof_terracotta_rear_row_2', parent: 'Roof_Structure', from: [-8.55, 26.6, 1.25], to: [8.55, 27.6, 2.6] });
  cubes.push({ name: 'roof_terracotta_rear_mid_east', parent: 'Roof_Structure', from: [-3.85, 24.8, 2.55], to: [8.55, 26.7, 4.5] });
  cubes.push({ name: 'roof_terracotta_rear_bot_east', parent: 'Roof_Structure', from: [-3.85, 23.0, 4.45], to: [8.55, 24.9, 6.5] });

  // =========================================================================
  // 14. CHIMNEY ON REAR-WEST CORNER WITH EXACTLY 2 POTS WITH FLARED RIMS
  // Sandstone masonry shaft flush with west facade, cream capital, 2 flue pots
  // =========================================================================
  cubes.push({ name: 'chimney_stone_base', parent: 'Chimney', from: [-8.1, 24.0, 2.6], to: [-3.9, 30.6, 6.2] });
  cubes.push({ name: 'chimney_stone_accent_1', parent: 'Chimney', from: [-8.2, 27.2, 2.5], to: [-3.8, 28.0, 6.3] });
  cubes.push({ name: 'cornice_cream_chimney_cap', parent: 'Chimney', from: [-8.3, 30.6, 2.4], to: [-3.7, 31.2, 6.4] });

  // Exactly 2 Victorian Terracotta Flue Pots with flared roll-top rims (1:1 with concept art!)
  // Pot 1 (West pot)
  cubes.push({ name: 'chimney_pot_shaft_1', parent: 'Chimney', from: [-7.3, 31.2, 3.8], to: [-6.1, 32.8, 5.0] });
  cubes.push({ name: 'chimney_pot_rim_1', parent: 'Chimney', from: [-7.45, 32.8, 3.65], to: [-5.95, 33.3, 5.15] });
  // Pot 2 (East pot)
  cubes.push({ name: 'chimney_pot_shaft_2', parent: 'Chimney', from: [-5.7, 31.2, 3.8], to: [-4.5, 32.8, 5.0] });
  cubes.push({ name: 'chimney_pot_rim_2', parent: 'Chimney', from: [-5.85, 32.8, 3.65], to: [-4.35, 33.3, 5.15] });

  // Masonry accent bricks on sandstone chimney shaft
  cubes.push({ name: 'brick_accent_chimney_1', parent: 'Chimney', from: [-8.15, 25.0, 3.2], to: [-7.75, 26.2, 4.4] });
  cubes.push({ name: 'brick_accent_chimney_2', parent: 'Chimney', from: [-4.8, 28.5, 2.55], to: [-4.0, 29.5, 2.65] });

  console.log(`Total cubes defined: ${cubes.length} (Target: 160-180 cubes, max 180)`);
  if (cubes.length < 130 || cubes.length > 180) {
    throw new Error(`Cube count ${cubes.length} violates budget requirement (130-180)!`);
  }

  // Send cubes in batches
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
    fill: '#5B8C3A'
  });

  console.log('--- Step 4: Baking 16x16 Color Swatch Palette & Mapping All Faces ---');
  await callBlockbench('execute_script', {
    code: `
      const swatches = [
        { id: 0, name: 'white_trim', x: 0, y: 0, hex: '#FFFFFF' },
        { id: 1, name: 'yellow_glow', x: 16, y: 0, hex: '#FBBF24' },
        { id: 2, name: 'cornice_cream', x: 32, y: 0, hex: '#FEF3C7' },
        { id: 3, name: 'facade_green', x: 48, y: 0, hex: '#5B8C3A' },
        { id: 4, name: 'brick_accent', x: 64, y: 0, hex: '#446E26' },
        { id: 5, name: 'wood_door', x: 80, y: 0, hex: '#713F12' },
        { id: 6, name: 'wood_dark', x: 96, y: 0, hex: '#451A03' },
        { id: 7, name: 'brass_gold', x: 112, y: 0, hex: '#FACC15' },
        { id: 8, name: 'awning_dark', x: 128, y: 0, hex: '#166534' },
        { id: 9, name: 'awning_light', x: 144, y: 0, hex: '#84CC16' },
        { id: 10, name: 'sign_bg_dark', x: 160, y: 0, hex: '#0F381E' },
        { id: 11, name: 'sign_lime', x: 176, y: 0, hex: '#FFE066' },
        { id: 12, name: 'plinth_stone', x: 192, y: 0, hex: '#6D4C41' },
        { id: 13, name: 'drainpipe_teal', x: 208, y: 0, hex: '#386B5C' },
        { id: 14, name: 'roof_terracotta', x: 224, y: 0, hex: '#C2410C' },
        { id: 15, name: 'roof_dark', x: 240, y: 0, hex: '#7C2D12' },
        // Row 1 (y = 16)
        { id: 16, name: 'book_wine', x: 0, y: 16, hex: '#991B1B' },
        { id: 17, name: 'book_navy', x: 16, y: 16, hex: '#1E3A8A' },
        { id: 18, name: 'book_terracotta', x: 32, y: 16, hex: '#C2410C' },
        { id: 19, name: 'book_amber', x: 48, y: 16, hex: '#D97706' },
        { id: 20, name: 'chimney_stone', x: 64, y: 16, hex: '#D4A373' },
        { id: 21, name: 'chimney_pot', x: 80, y: 16, hex: '#C2410C' },
        { id: 22, name: 'smoke_puff', x: 96, y: 16, hex: '#CBD5E1' },
        { id: 23, name: 'book_green', x: 112, y: 16, hex: '#166534' },
        { id: 24, name: 'chalkboard_dark', x: 128, y: 16, hex: '#1C2E24' }
      ];

      const t = Texture.all[0];
      t.edit((canvas) => {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#5B8C3A';
        ctx.fillRect(0, 0, 256, 256);
        swatches.forEach(s => {
          ctx.fillStyle = s.hex;
          ctx.fillRect(s.x, s.y, 16, 16);
        });

        // Add longitudinal tile grooves on roof terracotta swatch
        ctx.fillStyle = '#EA580C';
        for (let x = 224; x < 240; x += 4) {
          ctx.fillRect(x, 0, 2, 16);
        }
        ctx.fillStyle = '#5C220E';
        for (let x = 240; x < 256; x += 4) {
          ctx.fillRect(x, 0, 2, 16);
        }

        // Paint horizontal ventilation louver slats on swatch 4 (x: 64, y: 0)
        ctx.fillStyle = '#1C2E24'; // deep shadow between slats
        ctx.fillRect(64, 3, 16, 2);
        ctx.fillRect(64, 7, 16, 2);
        ctx.fillRect(64, 11, 16, 2);

        // Paint authentic pixel-art B-O-O-K-S on vertical blade sign texture (x: 160, y: 32, w: 32, h: 96)
        ctx.fillStyle = '#0F381E'; // dark pine background
        ctx.fillRect(160, 32, 32, 96);
        ctx.strokeStyle = '#713F12'; // timber border
        ctx.lineWidth = 2;
        ctx.strokeRect(161, 33, 30, 94);

        ctx.fillStyle = '#FFE066'; // warm golden honey pixel lettering
        function drawLetter(char, y) {
          const x = 170;
          if (char === 'B') {
            ctx.fillRect(x, y, 3, 13);
            ctx.fillRect(x+3, y, 6, 3);
            ctx.fillRect(x+3, y+5, 5, 2);
            ctx.fillRect(x+3, y+10, 6, 3);
            ctx.fillRect(x+8, y+2, 3, 4);
            ctx.fillRect(x+8, y+7, 3, 4);
          } else if (char === 'O') {
            ctx.fillRect(x, y, 3, 13);
            ctx.fillRect(x+8, y, 3, 13);
            ctx.fillRect(x+3, y, 5, 3);
            ctx.fillRect(x+3, y+10, 5, 3);
          } else if (char === 'K') {
            ctx.fillRect(x, y, 3, 13);
            ctx.fillRect(x+3, y+5, 3, 2);
            ctx.fillRect(x+6, y+2, 3, 4);
            ctx.fillRect(x+8, y, 3, 3);
            ctx.fillRect(x+6, y+6, 3, 4);
            ctx.fillRect(x+8, y+9, 3, 4);
          } else if (char === 'S') {
            ctx.fillRect(x, y, 11, 3);
            ctx.fillRect(x, y+3, 3, 3);
            ctx.fillRect(x, y+5, 11, 2);
            ctx.fillRect(x+8, y+7, 3, 3);
            ctx.fillRect(x, y+10, 11, 3);
          }
        }
        drawLetter('B', 36);
        drawLetter('O', 53);
        drawLetter('O', 70);
        drawLetter('K', 87);
        drawLetter('S', 104);
      });

      function getSwatchForName(name) {
        if (/electric_box/i.test(name)) return swatches[22];
        if (/wall_vent/i.test(name)) return swatches[4];
        if (/wall_green|gable_wall/i.test(name)) return swatches[3];
        if (/glow_yellow/i.test(name)) return swatches[1];
        if (/sign_blade_letter|sign_lime|sign_gold/i.test(name)) return swatches[11];
        if (/frame_white|sill_white|white_trim/i.test(name)) return swatches[0];
        if (/cornice_cream|chimney_cap|belt_course/i.test(name)) return swatches[2];
        if (/brick_accent/i.test(name)) return swatches[4];
        if (/door_handle|brass/i.test(name)) return swatches[7];
        if (/door_panel|bookstall_wood|chalkboard_wood|sign_wood|vitrine_wood|blade_wood/i.test(name)) return swatches[5];
        if (/panel_recess|wood_dark|door_frame|border|blade_bracket/i.test(name)) return swatches[6];
        if (/awning_dark/i.test(name)) return swatches[8];
        if (/awning_light/i.test(name)) return swatches[9];
        if (/sign_blade_board|sign_bg_dark/i.test(name)) return swatches[10];
        if (/chalkboard_dark/i.test(name)) return swatches[24];
        if (/plinth/i.test(name)) return swatches[12];
        if (/drainpipe/i.test(name)) return swatches[13];
        if (/roof_terracotta|roof_rib/i.test(name)) return swatches[14];
        if (/roof_dark|pot_hole/i.test(name)) return swatches[15];
        if (/book_wine/i.test(name)) return swatches[16];
        if (/book_navy/i.test(name)) return swatches[17];
        if (/book_terracotta/i.test(name)) return swatches[18];
        if (/book_amber/i.test(name)) return swatches[19];
        if (/book_green/i.test(name)) return swatches[23];
        if (/chimney_stone/i.test(name)) return swatches[20];
        if (/chimney_pot/i.test(name)) return swatches[21];
        if (/smoke_puff/i.test(name)) return swatches[22];
        return swatches[3];
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
      });
      Canvas.updateAll();
      return true;
    `
  });

  console.log('--- Step 5: Validating Model with check_model ---');
  const check = await callBlockbench('check_model');
  console.log(`Issues count: ${check.issue_count}`);
  if (check.issues && check.issues.length > 0) {
    console.log('Issues:', JSON.stringify(check.issues, null, 2));
  }

  console.log('--- Step 6: Saving model project file ---');
  const targetSavePath = path.join(process.cwd(), 'assets/models/books_townhouse.bbmodel');
  await callBlockbench('save_project', {
    file_path: targetSavePath
  });
  console.log(`--- Model saved successfully to ${targetSavePath} ---`);

  console.log('--- Step 7: Capturing high-resolution camera verification screenshots ---');
  async function captureView(filename, pos, target, w = 1000, h = 1500) {
    const data = await callBlockbench('execute_script', {
      code: `
        const prev = Preview.selected;
        if (typeof lights !== 'undefined') {
          lights.west.intensity = 0.32;
          lights.south.intensity = 0.35;
          lights.north.intensity = 0.35;
          lights.top.intensity = 0.45;
        }
        prev.controls.target.set(${target[0]}, ${target[1]}, ${target[2]});
        prev.camera.position.set(${pos[0]}, ${pos[1]}, ${pos[2]});
        prev.controls.update();
        return new Promise(res => Screencam.screenshotPreview(prev, { width: ${w}, height: ${h} }, res));
      `
    });
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filename, Buffer.from(base64Data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);
  }

  // 1. Front View: looking at facade (Z = -54 looking towards +Z)
  await captureView('/tmp/books_model_front.png', [0, 16.0, -54], [0, 16.0, 0]);

  // 2. 45° Isometric Hero View: looking at facade and right wall (X = -45, Z = -45)
  await captureView('/tmp/books_model_iso.png', [-45, 34.0, -45], [0, 16.0, 0]);
}

buildMasterpieceBooks().catch(err => {
  console.error('Failed to build books model:', err);
  process.exit(1);
});
