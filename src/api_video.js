var fs = require('fs');
var path = require('path');
module.exports = function (req,res) {
    let name = req.query.name;
    let type = req.query.type;
    let vpath = path.resolve(__dirname + `../assist/${name}.${type}`);
    if (!name || !type || !fs.existsSync(vpath)) return;
   
    let stat = fs.statSync(vpath);
    let fileSize = stat.size;
    let range = req.headers.range;
    if (range) {
        let parts = range.replace(/bytes=/, "").split("-");
        let start = parseInt(parts[0], 10);
        let end = parts[1] ? parseInt(parts[1], 10) : start + 999999;

        // end 在最后取值为 fileSize - 1 
        end = end > fileSize - 1 ? fileSize - 1 : end;

        let chunksize = (end - start) + 1;
        let file = fs.createReadStream(vpath, {
            start,
            end
        });
        let head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        let head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(vpath).pipe(res);
    }
}