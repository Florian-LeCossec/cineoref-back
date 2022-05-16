const dataMapper = require('../model/dataMapper.js');
const APIError = require('../handlers/APIError');
const fetch = require("node-fetch");
const stringSimilarity = require("string-similarity");
const jwt = require('jsonwebtoken');

const controller = {

    async submitRef (req,res, next) {
        const ref = req.body;
        console.log(ref);
       // -------- CHECK if {value} exists, if not : create it ---------- //
      const checkShow = await dataMapper.checkShowExist(ref)
      const checkedShow = Object.keys(checkShow)
      if(checkedShow != '0'){
          console.log("Adding Show");
        const createShow = await dataMapper.createShow(ref)
        }         

      const checkCharacter = await dataMapper.checkCharacterExist(ref)
      const checkedCharacter = Object.keys(checkCharacter)
      if(checkedCharacter != '0'){
          console.log("Adding Character");
        const createArtist = await dataMapper.createCharacter(ref)
      } 

      const checkArtist = await dataMapper.checkArtistExist(ref)
        const checkedArtist = Object.keys(checkArtist)
        if(checkedArtist != '0'){
            console.log("Adding Artist");
          const createArtist = await dataMapper.createArtist(ref)
        } 

        // -------- DECLARE and FILTER variables/parameters ---------- //

        const showId = await dataMapper.checkShowExist(ref)
                const show_id = {};
                for(let i = 0; i<showId.length; i++){
                    show_id['show_id_'+i] = showId[i];
                }
                const filtered_showId = show_id.show_id_0
                const param_showId = filtered_showId.id
        const characterId = await dataMapper.checkCharacterExist(ref)
                const character_id = {};
                for(let i = 0; i<characterId.length; i++){
                    character_id['character_id_'+i] = characterId[i];
                }
                const filtered_characterId = character_id.character_id_0
                const param_characterId = filtered_characterId.id
        const artistId = await dataMapper.checkArtistExist(ref)
                const artist_id = {};
                for(let i = 0; i<artistId.length; i++){
                    artist_id['artist_id_'+i] = artistId[i];
                }
                const filtered_artistId = artist_id.artist_id_0
                const param_artistId = filtered_artistId.id
        // ----- need to catch the user ID through session ----- //
        const userId = ref.user_id
        const reference = ref.reference

        // ---- CHECK or INSERT the ids INTO join tables ---- //
        const checkArtistList = await dataMapper.checkArtistListExist({param_artistId, param_showId})
        const checkedArtistList = Object.keys(checkArtistList)
        if (checkedArtistList != '0') {
            console.log("Adding to join table Artist");
            const createJoinArtistShow = await dataMapper.createJoinArtistShow({param_artistId, param_showId})
        }

        const checkCharacterList = await dataMapper.checkCharacterListExist({param_characterId, param_showId})
        const checkedCharacterList = Object.keys(checkCharacterList)
        if (checkedCharacterList != '0') {
            console.log("Adding to join table Character");
            const createJoinCharacterShow = await dataMapper.createJoinCharacterShow({param_characterId, param_showId})
        }

         // -------- SUBMIT the ref ---------- //

        const submitRef = await dataMapper.createRef({reference, userId, param_showId, param_artistId, param_characterId})
        res.json({
            submitRef, 
            message: "Citation ajoutée."})
    },
    
    async getByCategory(req, res, next) {
        const categories = req.params.params;
        console.log(categories);
        const result = await dataMapper.getRefByCategory(categories)
        res.json(result)
    },

    async getByArtist(req, res, next) {
        const artist = req.params.params;
        console.log(artist);
        const result = await dataMapper.getRefByArtist(artist)
        res.json(result)
    },

    async getByCharacter(req, res, next) {
        const character = req.params.params;
        console.log(character);
        const result = await dataMapper.getRefByCharacter(character)
        res.json(result)
    },

    async getByRandom(req, res, next) {
        const result = await dataMapper.getRefByRandom()
        res.json(result)
    },

    async getBySearchBar(req, res, next) {
        const param = req.params.params;
        function escapeRegExp(param) {
            let map = {
                '&': '&amp;',
                 '<': '&lt;',
                 '>': '&gt;',
                 '"': '&quot;',
                 "'": '&#039;',
                 "~": '&#126',
                 "`": '&grave',
                 "-": '&minus',
                 "#": '%23',
            };
            return param.replace(/[&<>"']/g, function(m) {return map[m];})
        }

        const keyword = escapeRegExp(param);
        console.log(keyword);
        const getRefBySearchBar = await dataMapper.getRefBySearchBar(keyword)
        const getShowBySearchBar = await dataMapper.getShowBySearchBar(keyword)
        const getArtistBySearchBar = await dataMapper.getArtistBySearchBar(keyword)
        const getCharacterBySearchBar = await dataMapper.getCharacterBySearchBar(keyword)
        
        res.json({getRefBySearchBar, getShowBySearchBar, getArtistBySearchBar, getCharacterBySearchBar})
    },
    
    async getByRecent(req,res,next) {
        const result = await dataMapper.getByRecent();
        res.json(result)
    },

    async getById(req,res,next) {
        const id = req.params
        console.log(id);
        const result = await dataMapper.getRefById(id)
        res.json(result)
    }

};

module.exports = controller;