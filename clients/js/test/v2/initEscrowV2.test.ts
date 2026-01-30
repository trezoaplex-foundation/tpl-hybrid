import test from 'ava';
import { generateSigner } from '@trezoaplex-foundation/umi';
import {
  string,
  publicKey as publicKeySerializer,
} from '@trezoaplex-foundation/umi/serializers';
import { createFungible } from '@trezoaplex-foundation/tpl-token-metadata';
import { createUmi } from '../_setup';
import {
  EscrowV2,
  fetchEscrowV2,
  initEscrowV2,
  TPL_HYBRID_PROGRAM_ID,
} from '../../src';

test('it can initialize the escrow', async (t) => {
  // Given a Umi instance using the trezoa's plugin.
  const umi = await createUmi();
  const tokenMint = generateSigner(umi);
  await createFungible(umi, {
    name: 'Test Token',
    uri: 'www.fungible.com',
    sellerFeeBasisPoints: {
      basisPoints: 0n,
      identifier: '%',
      decimals: 2,
    },
    mint: tokenMint,
  }).sendAndConfirm(umi);

  const escrow = umi.eddsa.findPda(TPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(umi.identity.publicKey),
  ]);

  await initEscrowV2(umi, {}).sendAndConfirm(umi);

  t.like(await fetchEscrowV2(umi, escrow), <EscrowV2>{
    authority: umi.identity.publicKey,
    bump: escrow[1],
  });
});
