import React from 'react';
import PhotoMemoryGame from '../games/PhotoMemoryGame';
import WordAssociationGame from '../games/WordAssociationGame';
import TwoTruthsLieGame from '../games/TwoTruthsLieGame';
import WouldYouRatherPoll from '../games/WouldYouRatherPoll';
import ThisOrThatPoll from '../games/ThisOrThatPoll';
import FillInBlankGame from '../games/FillInBlankGame';
import SpotDifferenceGame from '../games/SpotDifferenceGame';
import GuessWhoGame from '../games/GuessWhoGame';
import ReactionRaceGame from '../games/ReactionRaceGame';
// ...import any other necessary modules, hooks, or context...

const Games = () => {
  return (
    <div>
      <PhotoMemoryGame />
      <WordAssociationGame />
      <TwoTruthsLieGame />
      <WouldYouRatherPoll />
      <ThisOrThatPoll />
      <FillInBlankGame />
      <SpotDifferenceGame />
      <GuessWhoGame />
      <ReactionRaceGame />
      {/* Add any additional game components here */}
    </div>
  );
};

export default Games; 