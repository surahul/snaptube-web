var _ = require('lodash');

module.exports = exports = {
    getMeta: function(page, $alias) {
        var $title, $description, $keywords;
        switch (page) {
            case 'index':
                $title = "Easy YouTube Downloader :  Free Songs Download MP3";
                $description = "Search and Download latest songs and videos in your android device. Download videos in multiple resolutions in just one click. It's a simple fast and free tool.";
                break;
            case 'list':
                $title = "Youtube Video Download Android Application";
                $description = "Youtube video download now possible with Snaptube, world's best mobile application for video downloading. Download latest Bollywood songs and videos from YouTube.";
                break;
            case 'category':
                $title = "Latest Youtube Downloader Online";
                $description = "It's an advanced youtube downloader online for android based devices. Download videos from many categories like music, lifestyle, entertainment, sports.";
                $keywords = "youtube downloader online";
                if ($alias == 'alias' || !$alias) {
                    break;
                }
                $alias = $alias[0].toUpperCase() + $alias.slice(1);
                switch ($alias) {
                    case 'Music':
                        $title = "Latest Hindi Songs Free Download Android Application";
                        $description = "Download YouTube videos to your Android. Download any YouTube music video directly as an MP3 file. It’s easy, fast, and free.";
                        $keywords = "hindi songs free download";
                        break;
                    case 'Movies':
                        $title = "YouTube HD Videos Free Download ";
                        $description = "Download latest videos and music free from YouTube. Search latest movies and download in hd resolution on your mobile.";
                        $keywords = "hd videos free download";
                        break;
                    case 'Pets':
                        $title = "Cute Pets Video Free Download";
                        $description = "Watch and download funniest pets like cats, dogs’ video completely free on your mobile. Install in few steps.";
                        break;
                    case 'Education':
                        $title = "Download Educational Videos from YouTube";
                        $description = "Download fun and educational videos for your kids absolutely free on your mobile using Snaptube video downloader.";
                        break;
                    case 'Lifestyle':
                        $title = "Download latest Lifestyle Videos from Youtube";
                        $description = "Download popular lifestyle videos on YouTube in your android device in just one click. It's free and easy.";
                        break;
                    case 'Sports':
                        $title = "Download Popular YouTube Sports Video";
                        $description = "Search sports videos with keywords on youtube and download them on your android mobile free of cost. Share with your friends.";
                        break;
                    case 'Entertainment':
                        $title = "Download Entertainment Videos on Android";
                        $description = "Download entertainment videos from Youtube directly on your android mobile and share it with your friends.";
                        break;
                    case 'Others':
                        $title = "SnapTube - Download YouTube Videos and Music";
                        $description = "Download YouTube videos to your Android. It’s easy, fast, and free. Get the official version here.";
                        break;
                    case 'Games':
                        $title = "Transfer Popular Gaming Video from YouTube to Mobile";
                        $description = "Search popular gaming videos and download it on your android based smartphone without any charges. You can also share it with your friends.";
                        break;
                    case 'News':
                        $title = "YouTube News Videos : Search and Download ";
                        $description = "Download worldwide news videos from Youtube on your mobile on the go. Download video in multiple resolutions.";
                        break;
                    case 'Technology':
                        $title = "Technology Video Free Download";
                        $description = "Explore this category to download technology based video available in YouTube library. Download directly to your mobile using snaptube video downloader.";
                        break;
                    default:
                        break;
                }
                break;
            case 'top':
                $title = "Incredible Youtube Downloader Software";
                $description = "View top videos on youtube and download free using best youtube downloader on your smartphone. Its easy, free and fast";
                $keywords = "youtube downloader software";
                break;
            default:
                $title = 'SnapTube - Download YouTube Videos and Music';
                $description = 'Download YouTube videos to your Android. It’s easy, fast, and free. Get the official version here.';
                $keywords = "youtube mp3 downloader";
                // check pageTitle, add prefix Youtube, mp3 download - && Download YouTube videos to your Android. It’s easy, fast, and free. Get the official version here.
        };
        return {
            $title: $title,
            $description: $description,
            $keywords: $keywords
        };
    },
    genVideoDesc: function(title, crumbs) {
        crumbs = _.clone(crumbs);
        crumbs.pop();
        var tmp = this.getMeta.apply(this, (_.map(crumbs, function(i) {
            return _.first(i).toLowerCase();
        })));
        return title + " | " + tmp.$description;
    }
};