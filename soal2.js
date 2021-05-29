const diceGame = (players, dices) => {
    let playerArr = [];

    for (let i = 1; i <= players; i++) {
        let dicesArr = [];
        for (let x = 0; x < dices; x++) {
            dicesArr.push(0)
        }
        playerArr.push({
            "id" : i,
            "player" : `player #${i}`,
            "score" : 0,
            "dices" : dicesArr,
            "status": "on going"
        });
    }

    const randomDice = () => {
        return Math.floor((Math.random() * 6) + 1);
    }

    let gameEval = [];

    const startGame = () => {
        const gameStarter = playerArr.map(item => {
            const rollDice = [];
            for (let i = 0; i < item.dices.length; i++) {
                rollDice.push(item.dices[i] = randomDice());
            } 
            return {
                ...item,
                dices: rollDice
            }
        });
        return gameEval.push({
            "games" : `Game #${gameEval.length + 1}`,
            "result" : gameStarter,
            "evaluation" : {}
        });
    }

    startGame();

    const evaluateGame = () => {
        const selectedGameResult = gameEval[gameEval.length - 1].result;
        const diceChecking = selectedGameResult.map((item) => {
            const diceNumb1 = item.dices.filter(dice => dice == 1);
            const diceNumb6 = item.dices.filter(dice => dice == 6);
            const newDices = item.dices.filter(dice => dice != 1 & dice != 6);

            return {
                ...item,
                score: item.score + diceNumb6.length,
                dices: newDices,
                dicesNumb1: diceNumb1.length
            }
        });

        let firstEvaluation = []

        for (let i = 0; i < diceChecking.length; i++) {
            if (diceChecking.length - 1 == i) {
                if (diceChecking[diceChecking.length-1].dicesNumb1 > 0) {
                    let addedDices = []
                    for (let x = 0; x < diceChecking[diceChecking.length-1].dicesNumb1 ; x++) {
                        addedDices.push(0);
                    }
                    let newDices = diceChecking[0].dices;
                    newDices.push(addedDices)
                    const modified = {
                        ...diceChecking[0],
                        dices: newDices.flat(Infinity)
                    }
                    firstEvaluation.push(modified)
                } else {
                    firstEvaluation.push({
                        ...diceChecking[0]
                    })
                }
            } else {
                let addedDices = []
                for (let x = 0; x < diceChecking[i].dicesNumb1 ; x++) {
                    addedDices.push(0);
                }
                if (!diceChecking[i+1]) {
                    firstEvaluation.push({})
                } else {
                    let newDices = diceChecking[i+1].dices;
                    newDices.push(addedDices)
                    const modified = {
                        ...diceChecking[i+1],
                        dices: newDices.flat(Infinity)
                    }
                    firstEvaluation.push(modified)
                }
            }
        }

        let statusGameEvaluation = firstEvaluation.map(item => {
            if (item.dices.length < 0) {
                return {
                    ...item,
                    status: "Game Selesai"
                }
            } else {
                return {
                    ...item,
                }
            }
        });

        const sortingResult = statusGameEvaluation.sort((a, b) => a.id - b.id);

        return gameEval.splice(gameEval.length - 1, 1, {
            ...gameEval[gameEval.length - 1],
            evaluation: sortingResult
        })
    }

    evaluateGame();

    const gameOver = () => {
        const lastGameSelect = gameEval[gameEval.length - 1].evaluation;

        const statusGameEnd = lastGameSelect.filter(item => item.status == "Game Selesai");

        if (statusGameEnd.length == playerArr.length - 1) {
            return true;
        } else {
            return false;
        }
    }

    const nextTurn = () => {
        const lastGameResult = gameEval[gameEval.length - 1].evaluation;

        const newGameResult = lastGameResult.map(game => {
            let rollDices = [];
            for (let i = 0; i < game.dices.length; i++) {
                rollDices.push(game.dices[i] = randomDice())
            }
            return {
                ...game,
                dices: rollDices
            }
        });

        return newGameResult
    }

    const onGoingGame = () => {
        if (gameOver()) {
            const winnerFilter = gameEval[gameEval.length - 1].evaluation.filter(item => item.dices.length == 0);
            const winnerSort = winnerFilter.sort((a, b) => b.score - a.score);
            console.log("Game Play : ", gameEval);
            console.log(`The winner is ${winnerSort[0].player}`,winnerSort[0]);
        } else {
            gameEval.push({
                "games" : `Game #${gameEval.length + 1}`,
                "result" : nextTurn(),
                "evaluation" : {}
            });
            evaluateGame();
            onGoingGame();
        }
    }

    onGoingGame();
}
