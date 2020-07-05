function onYouTubeIframeAPIReady(){
	// NOTE: Must not be name-mangled - used by YouTube IFrame API
	$$$yt_player = new YT.Player('yt-player', {
		height: '390',
		width: '640',
		events:{
			'onStateChange':$$$YTPlayer_onStateChange
		}
	});
	$$$when_data_loaded();
}

function $$$when_data_loaded(){
	if($$$t === undefined || $$$d === undefined || $$$D === undefined || $$$P === undefined || $$$t2p === undefined || $$$x === undefined || $$$mt === undefined || $$$f2 === undefined || $$$yt_player === undefined)
		return;
	$$$init_tbls();
	let _x = $$$window_location_hash.substr(2);
	const c = $$$window_location_hash.substr(1,1);
	const _xs = /([^\/]+)\/(.*)$/.exec(_x);
	switch(c){
		case "f": $$$view_file(_x); break;
		case "t": $$$view_tag(_xs[2],_xs[1]);  break;
		case "x":
			$$$db_id = _xs[1];
			_x = _x2.substr(1);
			switch(_xs[2][0]){
				case "u": $$$view_user($$$db_id, _x); break;
			}
			break;
		case "$": $$$view_files_by_value(_x); break;
		case "d":
		case ":":
			$$$view_dir(_xs[2], (c===":"), _xs[1]);
			break;
	}
}

function $$$refetch_all_jsons(){
	$$$refetch_json('t', '/a/t.json', $$$when_data_loaded);
	$$$refetch_json('d', '/a/d.json', $$$when_data_loaded);
	$$$refetch_json('D', '/a/D.json', $$$when_data_loaded);
	$$$refetch_json('P', '/a/P.json', $$$when_data_loaded);
	$$$refetch_json('t2p', '/a/t2p.json', $$$when_data_loaded);
	$$$refetch_json('x', '/a/x.json', $$$when_data_loaded);
	$$$refetch_json('mt', '/a/mt.json', $$$when_data_loaded);
	$$$refetch_json('f2', '/a/f2.json', function(){$$$f2=$$$f2.split(",");$$$when_data_loaded()});
}

function $$$add_key_intercepts(){
	$$$Mousetrap_bind('p', $$$view_files_as_playlist);
	$$$Mousetrap_bind('v', e => $$$toggle('file2-container'));
	$$$Mousetrap_bind('b', $$$toggle_file_add_backup_dialog);
	$$$Mousetrap_bind('m', $$$merge_files);
	$$$Mousetrap_bind('q', e => $$$focus('qry'));
}
function $$$del_key_intercepts(){
	$$$Mousetrap_unbind('p');
	$$$Mousetrap_unbind('v');
	$$$Mousetrap_unbind('b');
	$$$Mousetrap_unbind('m');
	$$$Mousetrap_unbind('q');
}