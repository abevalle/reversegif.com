if (!process.env.FONTAWESOME_AUTH_TOKEN) {
    console.error('Error: FontAwesome auth token not set in environment variables');
    process.exit(1);
  } else {
    console.log('FontAwesome auth token is set');
  }
  