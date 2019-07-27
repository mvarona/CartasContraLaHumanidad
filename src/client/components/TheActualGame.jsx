import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Interweave from 'interweave';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const styles = (theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth: '13%',
    minHeight: '100px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class TheActualGame extends Component {
  render() {
    const { classes, username, game, playCard, czarPick } = this.props;
    
    const isCzar = game.players.indexOf(game.players.find((player) => {
      return username === player.username;
    })) === game.gameState.czar;
    const hasPlayedCard = game.gameState.playedWhiteCards.some((object) => object.username === username);
    const clientIndex = game.gameState.playedWhiteCards.indexOf(game.gameState.playedWhiteCards.find((player) => {
      return username === player.username;
    }));

    return (
      <div className={classes.root}>
        <Grid id='played-cards' container spacing={2}>
          <Grid className='card' item xs={1}>
            <Paper className={'black-card ' + classes.paper} style={{ position: 'relative' }}>
              <Interweave content={game.gameState.blackCard.text} />
              <br /><br />
              <Typography style={{
                color: 'rgba(255,255,255,0.6)',
                position: 'absolute',
                bottom: '0px',
                right: '5px'
              }}><strong>Pick {game.gameState.blackCard.pick}</strong></Typography>
            </Paper>
          </Grid>
          {
            isCzar
              ? game.gameState.czarReady
                ? <Grid className='card white-card' item xs={1}>
                  <Paper className={classes.paper} style={{ marginBottom: '10px' }}>Todos han jugado. Elije la(s) mejor(es) carta(s) blanca(s).</Paper>
                </Grid>
                : <Grid className='card white-card' item xs={1}>
                  <Paper className={classes.paper}>Eres el árbitro... Espera a que todos jueguen.</Paper>
                </Grid>
              : hasPlayedCard
                ? !game.gameState.czarReady
                  ? game.gameState.playedWhiteCards[clientIndex].cards.map((card, index) => {
                    return (
                      <Grid className='card card-hover white-card' item xs={1} key={index}>
                        <Paper className={classes.paper} style={{ marginBottom: '10px' }}><Interweave content={card} /></Paper>
                      </Grid>
                    );
                  })
                  : <Grid className='card white-card' item xs={1}>
                    <Paper className={classes.paper} style={{ marginBottom: '10px' }}>Espera a que el árbitro escoja la(s) mejor(es) carta(s) blanca(s).</Paper>
                  </Grid>
                : <Grid className='card white-card' item xs={1}>
                  <Paper className={classes.paper}>
                    Haz click en una carta para jugarla.
                    <br /><br />
                    {game.gameState.turnTimeLeft}
                  </Paper>
                </Grid>
          }
          {
            game.gameState.czarReady
              ? game.gameState.playedWhiteCards.map((player, index) => {
                return (
                  <Grid className='card card-hover white-card' item xs={1} key={index} onClick={
                    isCzar
                      ? czarPick(player.username)
                      : null
                  }>
                    {
                      player.cards.map((card, index) => {
                        return (
                          <Paper className={classes.paper} key={index} style={{ marginBottom: '10px', position: 'relative' }}>
                            <Interweave content={card} />
                            {
                              game.gameState.czarHasPicked
                                ? <Typography style={{
                                  color: 'rgba(0, 0, 0, 0.6)',
                                  position: 'absolute',
                                  bottom: '0px',
                                  right: '5px'
                                }}><strong>{player.username}</strong></Typography>
                                : null
                            }
                          </Paper>
                        );
                      })
                    }
                  </Grid>
                );
              })
              : null
          }
        </Grid>

        <ExpansionPanel style={{ marginTop: '20px', maxWidth: '500px' }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Puntos</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Jugador</TableCell>
                  <TableCell>Puntos Increíbles (10 para ganar)</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  game.players.map((player, playerIndex) => {
                    return (
                      <TableRow key={player.username}>
                        <TableCell component='th' scope='row'>
                          {
                            playerIndex === game.gameState.czar
                              ? player.username === username
                                ? <strong>{player.username} (Czar) (You)</strong>
                                : `${player.username} (Czar)`
                              : player.username === username
                                ? <strong>{player.username} (You)</strong>
                                : player.username
                          }
                        </TableCell>
                        <TableCell>
                          {player.score}
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <div id='hand'>
          <Typography variant='h4' style={{ marginBottom: '10px' }}>Your Hand:</Typography>
          <Grid container spacing={2}>
            <TransitionGroup component={React.Fragment}>
              {
                game.players.find((player) => {
                  return username === player.username;
                }).hand.map((card, cardIndex) => {
                  return (
                    <CSSTransition
                      key={card}
                      timeout={500}
                      classNames='item'
                    >
                      <Grid
                        className='card card-hover white-card'
                        item xs={1} onClick={playCard(cardIndex)}>
                        <Paper className={classes.paper}><Interweave content={card} /></Paper>
                      </Grid>
                    </CSSTransition>
                  );
                })
              }
            </TransitionGroup>
          </Grid>
        </div>
      </div>
    );
  }
}

export default hot(withStyles(styles)(TheActualGame));
