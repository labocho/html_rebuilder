(function() {
  var HtmlRebuilder;
  this.HtmlRebuilder = HtmlRebuilder = (function() {
    function HtmlRebuilder(document) {
      this.document = document;
    }
    HtmlRebuilder.prototype.doctype = function() {
      var buffer, name, public_id, system_id;
      if (!this.document.doctype) {
        return null;
      }
      name = this.document.doctype.name;
      public_id = this.document.doctype.publicId;
      system_id = this.document.doctype.systemId;
      buffer = [];
      if (name.length > 0) {
        buffer.push(name);
      }
      if (public_id.length > 0) {
        buffer.push("PUBLIC \"" + (this.escape(public_id)) + "\"");
      }
      if (system_id.length > 0) {
        buffer.push("\"" + (this.escape(system_id)) + "\"");
      }
      return "<!DOCTYPE " + (buffer.join(" ")) + ">";
    };
    HtmlRebuilder.prototype.html = function() {
      var doctype, html;
      html = this.document.getElementsByTagName("html")[0];
      if (!html) {
        return null;
      }
      doctype = this.doctype() || "";
      return doctype + this.element(html);
    };
    HtmlRebuilder.prototype.node = function(node) {
      switch (node.nodeName) {
        case "#text":
          return this.escape(node.nodeValue);
        case "#comment":
          return "<!--" + (this.escape(node.nodeValue)) + "-->";
          break;
        default:
          return this.element(node);
      }
    };
    HtmlRebuilder.prototype.element = function(element) {
      var c, inner_html, tag_name, _i, _len, _ref;
      tag_name = element.tagName.toLowerCase();
      inner_html = "";
      _ref = element.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        inner_html += this.node(c);
      }
      return "<" + tag_name + (this.attributes(element.attributes)) + ">" + inner_html + "</" + tag_name + ">";
    };
    HtmlRebuilder.prototype.attributes = function(attributes) {
      var a, buffer, _i, _len;
      buffer = "";
      for (_i = 0, _len = attributes.length; _i < _len; _i++) {
        a = attributes[_i];
        buffer += " " + a.name + "=\"" + (this.escape(a.value)) + "\"";
      }
      return buffer;
    };
    HtmlRebuilder.prototype.escape = function(text) {
      return text.replace(/&/, "&amp;").replace(/"/, "\"").replace(/</, "&lt;").replace(/>/, "&gt;");
    };
    return HtmlRebuilder;
  })();
}).call(this);
