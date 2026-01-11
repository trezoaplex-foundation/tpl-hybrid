import { UmiPlugin } from '@trezoaplex-foundation/umi';
import { createMplHybridProgram } from './generated';

export const tplHybrid = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplHybridProgram(), false);
  },
});
