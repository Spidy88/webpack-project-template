const ManifestPlugin = require('webpack-manifest-plugin');

function setupPlugin({ publicPath }) {
    return new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: publicPath,
        generate: (seed, files) => {
            const manifestFiles = files.reduce(function(manifest, file) {
                manifest[file.name] = file.path;
                return manifest;
            }, seed);
    
              return {
                files: manifestFiles
            };
        }
    });
}

module.exports = setupPlugin;