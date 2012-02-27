# Usage:
# var rebuilder = new HtmlRebuilder(document);
# rebuilder.html();
this.HtmlRebuilder = class HtmlRebuilder
  constructor: (@document) ->
  # Rebuild DOCTYPE tag from current document
  doctype: ->
    return null unless @document.doctype
    name = @document.doctype.name
    public_id = @document.doctype.publicId
    system_id = @document.doctype.systemId
    buffer = []
    buffer.push(name) if name.length > 0
    buffer.push("PUBLIC \"#{@escape(public_id)}\"") if public_id.length > 0
    buffer.push("\"#{@escape(system_id)}\"") if system_id.length > 0
    "<!DOCTYPE #{buffer.join(" ")}>"
  # Rebuild whole HTML from current document
  html: ->
    html = @document.getElementsByTagName("html")[0]
    return null unless html
    doctype = @doctype() || ""
    doctype + @element(html)
  # Rebuild HTML fragment from text / comment / element node (recursive)
  node: (node) ->
    switch node.nodeName
      when "#text"
        @escape(node.nodeValue)
      when "#comment"
        "<!--#{@escape(node.nodeValue)}-->"
      else
        @element(node)
  # Rebuild HTML fragment from element (recursive)
  element: (element) ->
    tag_name = element.tagName.toLowerCase()
    inner_html = ""
    for c in element.childNodes
      inner_html += @node(c)
    "<#{tag_name}#{@attributes(element.attributes)}>#{inner_html}</#{tag_name}>"
  # Return attributes string to insert into begin tag
  attributes: (attributes) ->
    buffer = ""
    for a in attributes
      buffer += " #{a.name}=\"#{@escape(a.value)}\""
    buffer
  # Escape &"<>
  escape: (text) ->
    text.
      replace(/&/, "&amp;").
      replace(/"/, "\"").
      replace(/</, "&lt;").
      replace(/>/, "&gt;")
