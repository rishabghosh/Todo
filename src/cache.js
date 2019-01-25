const createCache = function(fs) {
  const publicFiles = fs.readdirSync("./public/");
  const cache = {};

  const htmlFiles = publicFiles.filter(filename => filename.endsWith(".html"));

  htmlFiles.forEach(filename => {
    const path = "./public/" + filename;
    cache[path] = fs.readFileSync(path, "utf8");
  });

  return cache;
};

module.exports = { createCache };
