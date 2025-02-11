module.exports = {
    assets: ["./assets/"], // ✅ Ensures images and fonts are linked
    dependencies: {
      "react-native-svg": {
        platforms: {
          ios: null,  // Prevents auto-linking issues
          android: null,
        },
      },
    },
  };
  