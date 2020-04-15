import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

import { dataService } from '../shared';
import {
  GAME_UPDATE,
  GAME_CREATE,
  PLAYER_UPDATE,
  ROUND_START,
  ROUND_CANCEL,
  ROUND_CARD,
  ROUND_FINISH,
} from './mutation-types';

Vue.use(Vuex);

const state = () => ({
  game: {},
  player: {},
  round: {},
});

const mutations = {
  [GAME_CREATE](state, game) {
    state.game = game;
    if (game.players.length) {
      state.player = game.players[0];
    }
  },
  [GAME_UPDATE](state, game) {
    state.game = game;
  },
  [PLAYER_UPDATE](state, player) {
    state.player = player;
  },
  [ROUND_START](state, round) {
    state.round = round;
  },
  [ROUND_CANCEL](state) {
    state.round = {};
  },
  [ROUND_CARD](state, card) {
    state.round.cards.push(card);
  },
  [ROUND_FINISH](state, round) {
    state.round.winner = round.winner;
  },
};

const actions = {
  // actions let us get to ({ state, getters, commit, dispatch }) {
  setGameId({ commit, state }, value) {
    let game = _.cloneDeep(state.game);
    game.id = value;
    commit(GAME_UPDATE, game);
  },
  async createGameAction({ commit, state }) {
    const game = await dataService.newGame(state.player.name);
    commit(GAME_CREATE, game);
  },
  async getGameAction({ commit }, gameId) {
    const game = await dataService.getGame(gameId);
    commit(GAME_UPDATE, game);
  },
  async getPlayerAction({ commit, state }) {
    const player = await dataService.getPlayer(state.player.id);
    commit(PLAYER_UPDATE, player);
  },
  async addPlayerAction({ commit, state }, playerName) {
    const newPlayer = await dataService.addPlayer(playerName, state.game);
    commit(PLAYER_UPDATE, newPlayer);
  },
  setPlayerName({ commit, state }, value) {
    let player = _.cloneDeep(state.player);
    player.name = value;
    commit(PLAYER_UPDATE, player);
  },
  async startRoundAction({ commit, state }) {
    const round = await dataService.newRound(state.game);
    commit(ROUND_START, round);
  },
  async cancelRoundAction({ commit, state }) {
    await dataService.delRound(state.round.id);
    commit(ROUND_CANCEL);
  },
  async playCardAction({ commit, state }, card) {
    await dataService.newRoundCard(card, state.player, state.round);
    commit(ROUND_CARD, card);
  },
  async finishRound({ commit, state }, player) {
    const round = state.round;
    round.winner = player;
    round.status = 'finished';
    const finishedRound = await dataService.updateRound(round);
    commit(ROUND_FINISH, finishedRound);
  },
};

const getters = {
  getGameById: state => id => state.heroes.find(h => h.id === id),
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions,
  getters,
});
