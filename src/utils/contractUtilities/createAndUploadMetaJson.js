const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const filepath = 'temp';
const AvatarCollection = require("../../modules/avatarCollections/model");
const WeaponCollection = require("../../modules/weaponCollections/model");
const JetpackCollection = require("../../modules/bagpackCollection/model");
const SneakerCollection = require("../../modules/sneakerCollections/model");
const { deployNFTContractMarketplace } = require('../../../scripts/contractUtils');

const uploadMetaJSON = async ({ collectionData, type }) => {
  try {

    let collectionDataNew;

    if (type === 'legend') {
      collectionDataNew = await AvatarCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id) })
    }
    else if (type === 'weapon') {
      collectionDataNew = await WeaponCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id) })
    }
    else if (type === 'jetpack') {
      collectionDataNew = await JetpackCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id) })
    }
    else if (type === 'sneakers') {
      collectionDataNew = await SneakerCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id) })
    }

    console.log("step-------3");
    const { globSource, create } = await import('ipfs-http-client');
    const projectId = process.env.INFURA_API_KEY;
    const projectSecret = process.env.INFURA_API_KEY_SECRET;
    const jsonDirectoryPath = path.join(__dirname, "../../../", filepath, collectionDataNew._id.toString(), 'json');
    const auth =
      'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth
      }
    })
    const options = {
      wrapWithDirectory: true
    }
    console.log("step-------3.1");
    let fileArr = []
    for await (const file of client.addAll(globSource(jsonDirectoryPath, '**/*'), options)) {
      console.log("files----", file)
      fileArr.push(file)
    }
    const folderItem = fileArr[fileArr.length - 1];
    const folderCID = folderItem.cid ? folderItem.cid.toString() : null;
    if (!folderCID) {
      return { data: "Folder CID Not Created", status: false, code: 500 };
    }

    const deleteDirectory = (directoryPath) => {
      fs.rm(directoryPath, { recursive: true }, (err) => {
        if (err) {
          console.error(`Error deleting directory: ${directoryPath}`, err);
        } else {
          console.log(`Directory deleted: ${directoryPath}`);
        }
      });
    };

    if (type === 'legend') {
      await AvatarCollection.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(collectionDataNew._id) },
        {
          progressStatus: 4,
          "contractMeta.metaJsonCID": folderCID,
        },
        {
          new: true,
          useFindAndModify: false
        }
      )
    }
    else if (type === 'weapon') {
      await WeaponCollection.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(collectionDataNew._id) },
        {
          progressStatus: 4,
          "contractMeta.metaJsonCID": folderCID,
        },
        {
          new: true,
          useFindAndModify: false
        }
      )
    }
    else if (type === 'jetpack') {
      await JetpackCollection.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(collectionDataNew._id) },
        {
          progressStatus: 4,
          "contractMeta.metaJsonCID": folderCID,
        },
        {
          new: true,
          useFindAndModify: false
        }
      )
    }
    else if (type === 'sneakers') {
      await SneakerCollection.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(collectionDataNew._id) },
        {
          progressStatus: 4,
          "contractMeta.metaJsonCID": folderCID,
        },
        {
          new: true,
          useFindAndModify: false
        }
      )
    }

    const tempDirectoryPath = path.join(__dirname, "../../../", filepath);
    deleteDirectory(tempDirectoryPath);

    return await deployNFTContractMarketplace({ collectionData: collectionDataNew._doc, type })
  }
  catch (error) {
    console.log("error.message", error.message);
    return { data: error.message, status: false, code: 500 };
  }
};
module.exports = uploadMetaJSON;

