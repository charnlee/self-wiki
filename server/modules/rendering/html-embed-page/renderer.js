const cheerio = require('cheerio')
const _ = require('lodash')

module.exports = {
  async init(input, config) {
    const $ = cheerio.load(input, {
      decodeEntities: false
    })

    $('wiki-html-embed').each((idx, elm) => {
      const srcdocBase64 = $(elm).attr('data-srcdoc-b64') || ''
      const height = Math.max(_.toSafeInteger(config.defaultHeight) || 1200, 320)
      const iframe = [
        '<iframe',
        ' class="wiki-html-page-embed"',
        ' title="Embedded HTML page"',
        ' sandbox=""',
        ' loading="lazy"',
        ` src="data:text/html;charset=utf-8;base64,${srcdocBase64}"`,
        ` style="display:block;width:100%;min-height:${height}px;border:0;border-radius:12px;background:#fff"`,
        '></iframe>'
      ].join('')

      $(elm).replaceWith(iframe)
    })

    return $.html()
  }
}
