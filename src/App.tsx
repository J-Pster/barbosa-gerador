import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { BootstrapDialog, BootstrapDialogTitle } from './components/Popup'
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

interface TokenInfo {
  token_type: string,
  iat: number,
  expires_in: number,
  jwt_token: string,
  code: number,
}

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://joaopster.com.br/">
        João Pster
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const sxFlexCenter = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: "80vh", 
}

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [copyText, setCopyText] = React.useState("Copiar");
  const [generateText, setGenerateText] = React.useState("Gerar Link");
  const [tokenInfos, setTokenInfos] = React.useState({} as TokenInfo);

  const handleClickOpen = async () => {
    setGenerateText("Gerando...");

    // Make a post request
    await fetch('https://barbosarepresenta.com.br/wp-json/api/v1/mo-jwt', {
      method: 'POST',
      // Solve CORS problem
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: process.env.REACT_APP_LOGIN_USER_USERNAME,
        password: process.env.REACT_APP_LOGIN_USER_PASSWORD,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.code !== 200) return alert("Erro ao gerar token!");
        setTokenInfos(data);
      })
      .catch((error) => {
        alert("Erro ao gerar token!");
        console.error('Error:', error);
      });

    setGenerateText("Gerar Link Novamente");
    if(tokenInfos.code && tokenInfos.code === 200) setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const hadleClickCopy = () => {
    navigator.clipboard.writeText(`https://barbosarepresenta.com.br?mo_jwt_token=${tokenInfos.jwt_token}`);
    setCopyText("Copiado!");

    setTimeout(() => {
      setCopyText("Copiar");
    }, 2000);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const dataGet = {
      email: data.get('email'),
      password: data.get('password'),
    }

    const envGet = {
      email: process.env.REACT_APP_CORRECT_EMAIL,
      password: process.env.REACT_APP_CORRECT_PASSWORD,
    }
    
    if(dataGet.email === envGet.email && dataGet.password === envGet.password) {
      handleClickOpen();
    } else {
      alert("Email ou senha errados!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={sxFlexCenter}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Gerar novo link de login
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email do Administrador"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha do Administrador"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {generateText}
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Link gerado com sucesso!
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <b>Link Gerado:</b>
            <br/>
            <Link href={`https://barbosarepresenta.com.br?mo_jwt_token=${tokenInfos.jwt_token}`} target="_blank">
              https://barbosarepresenta.com.br?mo_jwt_token={tokenInfos.jwt_token}
            </Link>
          </Typography>
          <Typography gutterBottom>
            <b>Token:</b> {tokenInfos.jwt_token}
          </Typography>
          <Typography gutterBottom>
            <b>Expira Em:</b> {new Date(tokenInfos.expires_in * 1000).getMinutes()} minutos
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color='error' autoFocus onClick={handleClose}>
            Fechar
          </Button>
          <Button autoFocus onClick={hadleClickCopy}>
            {copyText}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </ThemeProvider>
  );
}