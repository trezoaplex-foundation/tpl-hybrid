/* eslint-disable import/no-extraneous-dependencies */
import { createUmi as basecreateUmi } from '@trezoaplex-foundation/umi-bundle-tests';
import {
  AssetV1,
  create,
  createCollection,
  fetchAsset,
  fetchCollection,
  tplCore,
} from '@trezoaplex-foundation/tpl-core';
import { generateSigner, PublicKey, Umi } from '@trezoaplex-foundation/umi';
import { tplTokenMetadata } from '@trezoaplex-foundation/tpl-token-metadata';
import { tplHybrid } from '../src';

export const DEFAULT_ASSET = {
  name: 'Test Asset',
  uri: 'https://exatple.com/asset',
};

export const DEFAULT_COLLECTION = {
  name: 'Test Collection',
  uri: 'https://exatple.com/collection',
};

export const createUmi = async () =>
  (await basecreateUmi())
    .use(tplHybrid())
    .use(tplCore())
    .use(tplTokenMetadata());

export async function createCoreCollection(umi: Umi, owner?: PublicKey) {
  const collectionAddress = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionAddress,
    ...DEFAULT_COLLECTION,
  }).sendAndConfirm(umi);

  const collection = await fetchCollection(umi, collectionAddress.publicKey);
  const newOwner = owner || umi.identity.publicKey;

  const assets: AssetV1[] = [];
  for (let i = 0; i < 10; i += 1) {
    const assetAddress = generateSigner(umi);
    // eslint-disable-next-line no-await-in-loop
    await create(umi, {
      asset: assetAddress,
      collection,
      owner: newOwner,
      ...DEFAULT_ASSET,
    }).sendAndConfirm(umi);
    // eslint-disable-next-line no-await-in-loop
    assets.push(await fetchAsset(umi, assetAddress.publicKey));
  }

  return { collection, assets };
}
