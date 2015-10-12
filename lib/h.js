'use strict';

var CLOSING = ['hr', 'img', 'br'];

var BLACKLISTED_ATTRIBUTES = ['id', 'name'];

/**
 * Compile a `node`, in `context`, into HTML.
 *
 * @example
 *   h(compiler, {
 *     'type': 'break'
 *     'attributes': {
 *       'id': 'foo'
 *     }
 *   }, 'br') // '<br id="foo">'
 *
 *   h(compiler, {
 *     'type': 'break'
 *   }, 'br', {
 *     'id': 'foo'
 *   }) // '<br id="foo">'
 *
 * @param {HTMLCompiler} context
 * @param {Node} node - mdast node.  If `node` has an
 *   `attributes` hash, its properties are also stringified
 *   as HTML attributes on the resulting node.
 * @param {string} name - Tag name to compile as.
 * @param {Object?} [attributes] - Attributes to add to the
 *   resulting node.
 * @param {string?} [children] - HTML to insert inside
 *   the resulting node.
 * @param {boolean} [loose] - Whether to add an initial and
 *   a trailing newline character inside the opening and
 *   closing tags.
 * @return {string} - HTML representation of `node`, based
 *   on the given options.
 */
function h(context, node, name, attributes, children) {
    var closing = CLOSING.indexOf(name) !== -1;

    attributes.key = ++context.reactKeyCounter;

    if (node != null && node.attributes){
        attributes = Object.keys(node.attributes).reduce(function(memo, key) {
            if (BLACKLISTED_ATTRIBUTES.indexOf(key) === -1) {
                memo[key] = node.attributes[key];
            }

            return memo;
        }, attributes);
    }

    if (closing) {
        return context.createElement(name, attributes);
    } else {
        if (!Array.isArray(children)) {
            children = [children];
        }
        var args = [name, attributes].concat(children);
        return context.createElement.apply(null, args);
    }
}

/*
 * Expose.
 */

module.exports = h;
