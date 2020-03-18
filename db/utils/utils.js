const types = require('pg').types;

exports.formatDates = (data, key) => {
  return data.map(item => {
    let newItem = { ...item }
    newItem[key] = new Date(newItem[key]).toISOString();
    return newItem;
  });
};

exports.makeRefObj = (ref, key, value) => {
  return ref.reduce((tot, cur) => {
    tot[cur[key]] = cur[value]
    return tot;
  }, {})
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    newCom = { ...comment }
    newCom.article_id = articleRef[newCom.belongs_to]
    delete newCom.belongs_to
    newCom.author = newCom.created_by
    delete newCom.created_by
    return newCom
  })
};

exports.formatDB = (req, res, next) => {
  types.setTypeParser(20, val => {
    return parseInt(val);
  });
  next();
}
