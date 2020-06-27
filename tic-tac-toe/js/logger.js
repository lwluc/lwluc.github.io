logger = function() {};

let isLogging = true;

logger.enableLogging = () => {
  logger.log('Enabled Logging');
  isLogging = true;
};

logger.disableLogging = () => {
  isLogging = false;
};

logger.log = function() {
  if (isLogging) {
    Array.from(arguments).forEach(a => console.log(a));
  }
};
