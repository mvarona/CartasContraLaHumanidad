import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { connect } from 'fullstack-system';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import playSound from '../js/play-sound';
import Interweave from 'interweave';

import Start from './Start';
import Game from './Game';

export let socket;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900]
    }
  },
  typography: {
    useNextVariants: true
  }
});
const styles = {
  root: {
    flexGrow: 1
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  },
  grow: {
    flexGrow: 1
  }
};

let playTimeout;

let connectTimeout;

function Transition(props) {
  return <Slide direction='up' {...props} />;
}
function TransitionLeft(props) {
  return <Slide {...props} direction='left' />;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Game
      username: '',
      connected: false,
      allDecksSelected: false,
      game: {},
      // Dialogs and text.
      dialog: {
        open: false,
        title: '',
        content: ''
      },
      endGameDialog: false,
      snackbarOpen: false,
      snackbarContent: '',
      // Post game.
      winner: '',
      clientScore: 0,
      log: []
    };
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  }

  componentDidUpdate() {
    
  }
  connectToGame = () => {
    const { username } = this.state;

    if(username === '' || username.length > 16) {
      this.setState({
        dialog: {
          open: true,
          title: 'Nombre de usuario inválido',
          content: 'El nombre de usuario es inválido. El nombre de usuario no puede estar vacío y no puede pasar de los 16 caracteres.'
        }
      });
      
      return;
    }

    socket = connect();

    connectTimeout = setTimeout(() => {
      socket.disconnect();
      this.setState({
        dialog: {
          open: true,
          title: 'Error al conectar',
          content: 'El cliente tarda demasiado en conectar con el servidor, puede que esté caído. Por favor, inténtalo de nuevo más tarde.'
        }
      });
      
      playSound('dialog');
    }, 1500);

    // When the client connects.
    socket.on('connect', async() => {
      clearTimeout(connectTimeout);
      socket.emit('newPlayer', this.state.username);
    });
    // If the username already exists in the server.
    socket.on('usernameExists', () => {
      this.setState({
        dialog: {
          open: true,
          title: 'El nombre de usuario ya existe en la sala',
          content: 'Hay otro jugador en la sala con el mismo nombre de usuario. Por favor, inténtalo de nuevo con otro usuario o espera a que termine su partida.'
        }
      });
      playSound('dialog');
    });
    socket.on('badCustomDeck', (content) => {
      this.setState({
        dialog: {
          open: true,
          title: 'JSON malformado',
          content: content
        }
      });
      playSound('dialog');
    });
    socket.on('roundStart', (timeoutTime) => {
      const playerIndex = this.state.game.players.findIndex((player) => this.state.username === player.username);
      
      if(playerIndex === 0) {
        socket.emit('roundStart', Date.now());
      }
      if(playerIndex !== this.state.game.gameState.czar) {
        playTimeout = setTimeout(() => {
          const playerIndex = this.state.game.players.findIndex((player) => this.state.username === player.username);
  
          // Play cards.
          for(let i = 0; i < this.state.game.gameState.blackCard.pick; i++) {
            const cardToPlay = Math.floor(Math.random() * this.state.game.players[playerIndex].hand.length);

            this.playCard(cardToPlay)();
          }
        }, timeoutTime * 1000 + 1000);
      }
    });
    // New game data.
    socket.on('updatedGame', (game) => {
      this.setState({ game: game });

      // Set state connected if not set already.
      if(!this.state.connected) {
        this.setState({ connected: true });
      }
    });
    // When the Czar picks the winner for the round.
    socket.on('roundWinner', (username) => {
      this.setState({
        snackbarOpen: true,
        snackbarContent: `${username} gana la ronda. Siguiente ronda en 3 segundos...`
      });
      playSound('round-winner');
    });
    // When someone wins.
    socket.on('winner', (winnerUsername, players, log) => {
      const playerIndex = players.findIndex((player) => this.state.username === player.username);
      
      this.setState({
        endGameDialog: true,
        winner: winnerUsername,
        clientScore: players[playerIndex].score,
        log: log
      });
      socket.disconnect();
      playSound('winner');
    });
    // If there isn't enough people to continue the game.
    socket.on('gameEndNotEnoughPlayers', () => {
      this.setState({
        dialog: {
          open: true,
          title: 'No hay suficientes jugadores',
          content: 'Por este motivo, el juego se ha cerrado.'
        }
      });
      socket.disconnect();

      playSound('dialog');
    });
    // If the server stops working.
    socket.on('disconnect', () => {
      this.setState({
        connected: false,
        game: {}
      });
      socket.disconnect();
      
      if(!this.state.usernameExistsDialog && !this.state.notEnoughPlayersDialog && !this.state.username === '') {
        this.setState({
          dialog: {
            open: true,
            title: 'Servidor desconectado',
            content: 'Has sido desconectado del juego. Esto se puede deber a que el juego terminó, el servidor está caído o ha dejado de funcionar.'
          }
        });

        playSound('dialog');
      }
    });
  }
  toggleDeck = (deckCodeName) => () => {
    // Fail safe even though the checkbox is disabled.
    if(deckCodeName !== 'base-set') {
      const newState = this.state.game;
      const deckArray = newState.decks;
      const deckIndex = deckArray.indexOf(deckArray.find((deck) => {
        return deck.codeName === deckCodeName;
      }));

      deckArray[deckIndex].selected = !deckArray[deckIndex].selected;
      
      socket.emit('updatedDecks', newState.decks);
      this.setState(newState);
    }
  }
  toggleAllDecks = () => {
    const toggledDecks = this.state.game.decks;

    toggledDecks.forEach((deck, index) => {
      if(deck.codeName !== 'base-set') {
        toggledDecks[index].selected = !this.state.allDecksSelected;
      }
    });

    this.setState((prevState) => ({
      allDecksSelected: !prevState.allDecksSelected,
      game: {
        ...prevState.game,
        decks: toggledDecks
      }
    }));
    socket.emit('updatedDecks', toggledDecks);
  }
  newCustomDeck = (file) => () => {
    socket.emit('newCustomDeck', file);
  }
  start = (timeoutTime) => () => {
    socket.emit('start', timeoutTime);
  }
  playCard = (cardIndex) => () => {
    const isCzar = this.state.game.players.indexOf(this.state.game.players.find((player) => {
      return this.state.username === player.username;
    })) === this.state.game.gameState.czar;
    const clientPlayedCards = this.state.game.gameState.playedWhiteCards.find((object) => {
      return object.username === this.state.username;
    });
    
    let hasPlayedCards;

    if(clientPlayedCards) {
      hasPlayedCards = clientPlayedCards.cards.length === this.state.game.gameState.blackCard.pick;
    }

    // If the player can play cards.
    if(!isCzar && !hasPlayedCards) {
      const playerIndex = this.state.game.players.findIndex((player) => this.state.username === player.username);

      socket.emit('playedCard', this.state.username, this.state.game.players[playerIndex].hand[cardIndex]);
      playSound('play');
      
      clearTimeout(playTimeout);
    }
  }
  czarPick = (player) => () => {
    if(!this.state.game.gameState.czarHasPicked) {
      socket.emit('czarPicked', player);
    }
  }
  disconnect = () => {
    socket.close();
    this.setState({
      connected: false,
      game: {}
    });
  }
  kill = () => {
    socket.emit('kill');
  }
  closeDialog = () => {
    this.setState((prevState) =>  ({
      dialog: {
        ...prevState.dialog,
        open: false
      }
    }));
  };
  closeEndGameDialog = () => {
    this.setState({ endGameDialog: false });
  }
  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  render() {
    const { classes } = this.props;
    
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position='static' color='primary'>
            <Toolbar>
              <Typography variant='h6' color='inherit' className={classes.grow}>
                Cartas contra la Humanidad
              </Typography>

              <Typography variant='h6' color='inherit'>{this.state.connected ? this.state.username : null}</Typography>
            </Toolbar>
          </AppBar>

          {
            this.state.connected
              ? <Game
                username={this.state.username}
                game={this.state.game}
                disconnect={this.disconnect}
                start={this.start}
                playCard={this.playCard}
                czarPick={this.czarPick}
                kill={this.kill}
                decks={this.state.game.decks}
                toggleDeck={this.toggleDeck}
                newCustomDeck={this.newCustomDeck}
                toggleAllDecks={this.toggleAllDecks}
              />
              : <Start
                username={this.state.username}
                handleUsernameChange={this.handleUsernameChange}
                connect={this.connectToGame}
              />
          }

          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={this.state.snackbarOpen}
            autoHideDuration={3000}
            TransitionComponent={TransitionLeft}
            onClose={this.handleSnackbarClose}
            ContentProps={{
              'aria-describedby': 'message-id'
            }}
            message={
              <span id='message-id'>{this.state.snackbarContent}</span>
            }
          />

          <Dialog
            open={this.state.dialog.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.closeDialog}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
          >
            <DialogTitle id='alert-dialog-slide-title'>{this.state.dialog.title}</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-slide-description'>
                {this.state.dialog.content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog} color='primary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            fullScreen
            open={this.state.endGameDialog}
            onClose={this.closeEndGameDialog}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <IconButton color='inherit' onClick={this.closeEndGameDialog} aria-label='Cerrar'>
                <CloseIcon />
              </IconButton>
            </AppBar>
            <Typography variant='h4' style={{ textAlign: 'center', marginTop: '10px' }}>Resumen del juego</Typography>
            <List>
              <Button variant='outlined' onClick={() => {
                const blob = new Blob([ this.state.log.join('\n') ], { type: 'text/plain', endings: 'native' });

                const a = document.createElement('a');

                a.download = 'log.txt';
                a.href = URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => {
                  URL.revokeObjectURL(a.href);
                }, 1500);
              }} style={{ marginLeft: '15px' }}>
                Download Log (.txt)
              </Button>
              <ListItem>
                <ListItemText primary='Ganador' secondary={this.state.winner} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary='Tu puntuación' secondary={this.state.clientScore} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary='Log de la partida' secondary={<Interweave content={this.state.log.join('<br />')}/>} />
              </ListItem>
            </List>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default hot(withStyles(styles)(App));
