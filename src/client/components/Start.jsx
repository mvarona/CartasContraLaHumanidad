import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  paperRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: '10px'
  },
  textField: {
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    margin: theme.spacing.unit,
    marginTop: '16px',
    height: '56px'
  }
});

class Start extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div id='connect-area'>
        <h1>Cartas contra la Humanidad</h1>
        <Typography paragraph>¡Bienvenido a Cartas contra la Humanidad! Si nunca lo has oído, es un juego en el que un jugador hace una pregunta de una Carta Negra, y todo el mundo responde con sus mejores Cartas Blancas. ¡Cuánto más raro, más risas!<br/><br/>
        ¡Lo hemos modificado un poco para hacerlo más divertido: pueden jugar desde 3 personas!
        </Typography>

        <p align="center">
          <img alt="Gif introductorio" src="https://bmsalamanca.com/others/cartascontralahumanidad/hero.gif">
        </p>

        <Paper className={classes.paperRoot} elevation={1}>
          <Typography variant='h5' component='h3'>
            Crea una partida o únete a la actual
          </Typography>
          <TextField
            id='username'
            label='Nombre de usuario'
            className={classes.textField}
            value={this.props.username}
            onChange={this.props.handleUsernameChange}
            margin='normal'
            variant='outlined'
          />
          <Button variant='outlined' color='primary' className={classes.button} onClick={this.props.connect}>
            Jugar
          </Button>
        </Paper>
        <Paper className={classes.paperRoot}>
          <Typography variant='h5'>Publica tus barajas de cartas</Typography>
          <br/>
          <Typography paragraph>¿Quieres que tu baraja personalizada esté en el juego? ¡Las contribuciones son bienvenidas!
          <br/>
          Lee la documentación en <a href='https://cards-against-humanity.netlify.com/#/custom-decks' target='_blank' rel='noreferrer noopener'>https://cards-against-humanity.netlify.com/#/custom-decks</a>, abre un issue de Github en <a href='https://github.com/mvarona/CartasContraLaHumanidad/issues' target='_blank' rel='noreferrer noopener'>https://github.com/mvarona/CartasContraLaHumanidad/issues</a> y lo revisaremos.</Typography>
        </Paper>
        <Paper className={classes.paperRoot}>
          <Typography variant='h5'>Una adaptación de </Typography>
          <br/>
          <Typography paragraph><a href='https://github.com/SergioPucela' target='_blank' rel='noreferrer noopener'>Sergio Ferreras</a> y <a href='https://github.com/mvarona/' target='_blank' rel='noreferrer noopener'>Mario Varona</a>.</Typography>
        </Paper>
      </div>
    );
  }
}

export default hot(withStyles(styles)(Start));
