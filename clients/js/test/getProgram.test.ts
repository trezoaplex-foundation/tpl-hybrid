import test from 'ava';
import { TPL_HYBRID_PROGRAM_ID } from '../src';
import { createUmi } from './_setup';

test('it registers the program', async (t) => {
  // Given a Umi instance using the trezoa's plugin.
  const umi = await createUmi();

  // When we fetch the registered program.
  const program = umi.programs.get('tplHybrid');

  // Then we expect it to be the same as the program ID constant.
  t.true(program.publicKey === TPL_HYBRID_PROGRAM_ID);
});
