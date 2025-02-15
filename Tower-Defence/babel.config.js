module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Other plugins (if any) can go here
      'react-native-reanimated/plugin', // This must be the last plugin!
    ],
  };
};
