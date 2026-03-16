import React, { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from './shared/Modal';
import Card from './Card';
import { robots, type Robot } from '../robots';

interface Player {
  active: boolean;
  matches: number;
}

const shuffle = (robots: Robot[]): Robot[] => {
  // use Fisher-Yates for truly random but for simple game it's fine
  robots.sort(() => {
    return 0.5 - Math.random();
  });
  return robots;
};

const App = (): React.JSX.Element => {
  const [shuffleBots, setShuffleBots] = useState<Robot[]>(shuffle([...robots]));
  const [selected, setSelected] = useState<number[]>([]);
  const [index, setIndex] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());
  const [bluePlayer, setBluePlayer] = useState<Player>({
    active: true,
    matches: 0,
  });
  const [redPlayer, setRedPlayer] = useState<Player>({
    active: false,
    matches: 0,
  });
  const [isChecking, setIsChecking] = useState(false);

  // Handle matching when 2 cards are selected
  useEffect(() => {
    if (selected.length === 2 && !isChecking) {
      setIsChecking(true);

      const timeout = setTimeout(() => {
        const [cardA, cardB] = selected;
        const indexA = index[0];
        const indexB = index[1];

        if (cardA === cardB) {
          // Cards match - mark as matched and increment score
          setMatchedIndices((prev) => new Set([...prev, indexA, indexB]));

          if (bluePlayer.active) {
            setBluePlayer((prev) => {
              const newMatches = prev.matches + 1;
              if (newMatches === 4) {
                setTimeout(
                  () => toast.success('Blue Player Wins!', { icon: '💙' }),
                  0
                );
              } else if (newMatches === 3 && redPlayer.matches === 3) {
                setTimeout(() => toast('It is a tie!', { icon: '🤝' }), 0);
              }
              return { ...prev, matches: newMatches };
            });
          } else {
            setRedPlayer((prev) => {
              const newMatches = prev.matches + 1;
              if (newMatches === 4) {
                setTimeout(
                  () => toast.error('Red Player Wins!', { icon: '❤️' }),
                  0
                );
              } else if (newMatches === 3 && bluePlayer.matches === 3) {
                setTimeout(() => toast('It is a tie!', { icon: '🤝' }), 0);
              }
              return { ...prev, matches: newMatches };
            });
          }
        } else {
          // Cards don't match - flip them back and switch player
          setShuffleBots((prev) =>
            prev.map((bot, i) =>
              (i === indexA || i === indexB) && !matchedIndices.has(i)
                ? { ...bot, isFaceUp: false }
                : bot
            )
          );
          setBluePlayer((prev) => ({ ...prev, active: !prev.active }));
          setRedPlayer((prev) => ({ ...prev, active: !prev.active }));
        }

        // Reset selection
        setSelected([]);
        setIndex([]);
        setIsChecking(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [selected]);

  const playerInfo = (): React.JSX.Element => {
    if (bluePlayer.active) {
      return <p className="player-text text-info">Blue Player's Turn</p>;
    }
    return <p className="player-text text-danger">Red Player's Turn</p>;
  };

  const handleFlip = useCallback(
    (robot: Robot, i: number): void => {
      // Prevent flipping if:
      // 1. Card is already flipped (but allow if it's the same card being clicked again)
      // 2. Already selected 2 cards
      // 3. Currently checking for match
      // 4. Card has been matched already
      if (
        (shuffleBots[i].isFaceUp && !selected.includes(robot.id)) ||
        selected.length >= 2 ||
        isChecking ||
        matchedIndices.has(i)
      ) {
        return;
      }

      const id = robot.id;
      const cleanClick = i !== index[0];

      if (cleanClick) {
        setShuffleBots((prev) =>
          prev.map((bot, idx) => (idx === i ? { ...bot, isFaceUp: true } : bot))
        );
        setSelected((prev) => [...prev, id]);
        setIndex((prev) => [...prev, i]);
      }
    },
    [shuffleBots, selected, index, isChecking, matchedIndices]
  );

  const reShuffle = useCallback((): void => {
    const newBots = shuffle([...robots]);
    newBots.forEach((bot) => (bot.isFaceUp = false));
    setShuffleBots(newBots);
    setSelected([]);
    setIndex([]);
    setMatchedIndices(new Set());
    setIsChecking(false);
    setBluePlayer({ active: true, matches: 0 });
    setRedPlayer({ active: false, matches: 0 });
    (window as any).$('#modal').modal('hide');
  }, []);

  return (
    <main className="container-fluid">
      <div className="info d-flex justify-content-between mt-4">
        <button
          type="button"
          data-toggle="modal"
          data-target="#modal"
          className="btn btn-raised btn-success"
        >
          Restart
        </button>
        {playerInfo()}
        <table>
          <thead>
            <tr>
              <th className="text-info pr-3">Blue Player</th>
              <th className="text-danger">Red Player</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bluePlayer.matches}</td>
              <td>{redPlayer.matches}</td>
            </tr>
          </tbody>
        </table>
        <div className="mobile-stats mt-4 pr-2">
          <p className="text-info d-inline font-weight-bold pr-3">
            Blue Player: {bluePlayer.matches}
          </p>
          <p className="text-danger d-inline font-weight-bold">
            Red Player: {redPlayer.matches}
          </p>
        </div>
      </div>
      <div className="card-deck">
        <Card shuffleBots={shuffleBots} handleFlip={handleFlip} />
      </div>
      <Modal
        closeText="Cancel"
        confirmText="Yes"
        handleClick={() => reShuffle()}
      >
        <p>Are you sure you want to reshuffle and restart the game?</p>
      </Modal>
    </main>
  );
};

export default App;
