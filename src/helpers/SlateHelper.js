var Term = require("../models/Term");
// https://stackoverflow.com/questions/40294870/module-exports-vs-export-default-in-node-js-and-es6
var Html = require('slate-html-serializer').default;
var Value = require('slate').Value;

const wrapTerm = function(term) {
  return `<a href='${term._id}'>${term.term}</a>`;
};

var BLOCK_TAGS = {
  'paragraph': 'p',
  'list-item': 'li',
  'bulleted-list': 'ul',
  'numbered-list': 'ol',
  'block-quote': 'blockquote',
  'heading-one': 'h1',
  'heading-two': 'h2',
  'link': 'a',
  'image': 'img',
}

const MARK_TAGS = {
  'bold': 'strong',
  'italic': 'em',
  'underline': 'u',
  'code': 'code',
}


/**
 * Serializer rules.
 * Each rule defines how to deserialize and serialize a node or mark, by implementing two functions.
 * For object, expect a Node || Mark || String
 * @type {Array}
 */
const RULES = [
  {
    serialize(object, children) {
      const mark = object.type && MARK_TAGS[object.type.toLowerCase()];
      if (mark) {
        console.log(`<${mark}>${children[0]}</${mark}>`);
        return `<${mark}>${children[0]}</${mark}>`;
      }
    },
  },
  {
    serialize(object, children) {
      const block = object.type && BLOCK_TAGS[object.type.toLowerCase()];
      if (block) {
        console.log(`<${block}>${children}</${block}>`);
        return `<${block}>${JSON.stringify(children)}</${block}>`;
      }
    },
  }
];

/**
 * Create a new HTML serializer with `RULES`.
 * @type {Html}
 */
const serializer = new Html({ rules: RULES, parseHtml: null });

exports.jsonToHtml = function(json) { 
  Term.find({})
  .then(terms => {
    const val = Value.fromJSON(json);
    const result = serializer.serialize(val);
    console.log('final result:');
    console.log(result);
    return 'hello world';
  })
  .catch(err => {
    throw err;
  });
};
