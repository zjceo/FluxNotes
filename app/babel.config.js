module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // 1. Preset de Expo, habilitando NativeWind V4+ con jsxImportSource
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      // 2. Plugin de Reanimated (DEBE ser el último plugin listado)
      'react-native-reanimated/plugin',
      
      // ⚠️ NO INCLUIR el plugin de worklets, ya que no se encontró
      // 'react-native-worklets/plugin', 
    ],
  };
};