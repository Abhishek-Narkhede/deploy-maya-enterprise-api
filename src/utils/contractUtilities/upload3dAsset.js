const mongoose = require('mongoose');
const AvatarCollection = require("../../modules/avatarCollections/model");
const WeaponCollection = require("../../modules/weaponCollections/model")
const JetpackCollection = require("../../modules/bagpackCollection/model")
const SneakersCollection = require("../../modules/sneakerCollections/model")
const { default: axios } = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const createEditions = require('../../modules/editions/services/createEditions.service');
const filepath = 'temp';

const upload3DAsset = async ({ collectionData, type }) => {

    const { globSource, create } = await import('ipfs-http-client');
    let collectionDataNew;

    if (type == 'legend') {
         collectionDataNew =  await AvatarCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id)})
         
    }else if(type == 'weapon'){
        collectionDataNew =  await WeaponCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id)}) 
    }
    else if(type == 'jetpack'){
        collectionDataNew =  await JetpackCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id)}) 
    }
    else if(type == 'sneakers'){
        collectionDataNew =  await SneakersCollection.findOne({ _id: mongoose.Types.ObjectId(collectionData._id)}) 
    }

   
    /* upload Image Asset */
    const projectId = process.env.INFURA_API_KEY;
    const apiUrl = `https://ipfs.infura.io:5001/api/v0/add?pin=true&cid-version=0&project=${projectId}`;
    const projectSecret = process.env.INFURA_API_KEY_SECRET;
    const assetDirectoryPath = path.join(__dirname, "../../../", filepath, collectionDataNew._id.toString(), 'asset');

    if (!fs.existsSync(assetDirectoryPath)) {
        fs.mkdirSync(assetDirectoryPath, { recursive: true });
    }

    const response = await axios({
        url: collectionDataNew.asset3dFile,
        method: 'GET',
        responseType: 'stream'
    });

    const filename = `${Date.now()}.glb`; // Use a unique filename based on the timestamp
    const fileFullPath = path.join(assetDirectoryPath, filename);

    await new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(fileFullPath))
            .on('error', reject)
            .on('finish', () => resolve(fileFullPath));
    });

    if (response.status == 200) {
        const fileContent = fs.readFileSync(fileFullPath);

        // Prepare the request payload
        const formData = new FormData();
        formData.append('file', fileContent);

        // Generate a random boundary string
        const boundary = formData.getBoundary();

        // Set the authorization header
        const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');
        const headers = {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Authorization': auth,
        };

        // Send the file upload request to Infura
        try {
            const response = await axios.post(apiUrl, formData, {
                headers: headers,
                maxBodyLength: Infinity,
            })
            if (response?.data) {

                const ipfsHash = response.data.Hash;
                console.log('File uploaded successfully. IPFS hash:', ipfsHash);

                if (type === 'legend') {
                    // Update the AvatarCollection document with the CID
                    await AvatarCollection.findOneAndUpdate(
                        { _id: mongoose.Types.ObjectId(collectionDataNew._id) },
                        {
                            "contractMeta.asset3DCID": ipfsHash,
                            progressStatus: 2
                        },
                        {
                            new: true,
                            useFindAndModify: false
                        }
                    )
                }
                else if (type === 'weapon') {
                   // Update the WeaponCollection document with the CID
                    await WeaponCollection.findOneAndUpdate(
                        { _id: mongoose.Types.ObjectId(collectionDataNew._id) },
                        {
                            "contractMeta.asset3DCID": ipfsHash,
                            progressStatus: 2
                        },
                        {
                            new: true,
                            useFindAndModify: false
                        }
                    ) 
                }
                else if (type === 'jetpack') {
                   // Update the WeaponCollection document with the CID
                    await JetpackCollection.findOneAndUpdate(
                        { _id: mongoose.Types.ObjectId(collectionDataNew._id) },
                        {
                            "contractMeta.asset3DCID": ipfsHash,
                            progressStatus: 2
                        },
                        {
                            new: true,
                            useFindAndModify: false
                        }
                    ) 
                }
                else if (type === 'sneakers') {
                   // Update the WeaponCollection document with the CID
                    await SneakersCollection.findOneAndUpdate(
                        { _id: mongoose.Types.ObjectId(collectionDataNew._id) },
                        {
                            "contractMeta.asset3DCID": ipfsHash,
                            progressStatus: 2
                        },
                        {
                            new: true,
                            useFindAndModify: false
                        }
                    ) 
                }
                // collectionData = { ...collectionData, contractMeta:{...collectionData.contractMeta,asset3DCID: ipfsHash} }
                const res = await createEditions({ collectionData:collectionDataNew._doc, type })
                return res
            }
        } catch (error) {
            console.error('Error uploading file to Infura:', error.message);
            return { status: false, data: error.message, code: 500 }
        }
    }

    /* upload 3d asset */

};

module.exports = upload3DAsset;
