(function () {
    "use strict";
    const debug = require('debug')('app4');
    const feedparser = require('feedparser-promised');
    const RssParser = require('rss-parser');
    let rssParser = new RssParser();

    exports.parser = function (req, res) {
        let body = Object.assign({}, req.body, req.params, req.query);

        (async () => {

            if (body.xmlurl) {
                try {
                    let _feed = await rssParser.parseURL(body.xmlurl);
                    return res.send({
                        code: 200,
                        data: _feed
                    });

                } catch (e) {
                    console.error(e.message, '继续使用 feedparser 抓取', body.xmlurl)
                    feedparser.parse({uri: body.xmlurl, timeout: 10000}).then(function (items) {
                        return res.send({
                            code: 200,
                            data: {items: items}
                        });
                    }).catch(function (err) {
                        return res.send({
                            code: 500,
                            info: err.message
                        });
                    })
                }

            } else {
                return res.send({
                    code: 500,
                    info: 'url 不存在'
                });
            }


        })();

    };


})();