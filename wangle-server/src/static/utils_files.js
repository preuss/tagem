"function populate_f_table(url, selector){"
	"get_json(url, function(data){"
		"var s = \"\";"
		"for (var ls of data){"
			"s += \"<div class='tr' data-id='\" + ls[1] + \"'>\";"
				"s += '<div class=\"td\"><img class=\"thumb\" src=\"' + ls[0] + '\"></img></div>';"
				//"s += \"<td><a href='/d#\" + ls[1] + \"'>\" + ls[2] + \"</a></td>\";" // Dir  ID and name
				"s += \"<div class='td fname'><a href='/f#\" + ls[1] + \"'>\" + ls[2] + \"</a></div>\";" // File ID and name
				"s += \"<div class='td'>\" + ls[3] + \"</div>\";"
				
			"s += \"</div>\";"
		"}"
		"$(selector).html(s);"
		"column_id2name(\"/a/t.json\", selector, '/t#', 2);"
	"});"
"}"
"function tag_files(file_ids, tagselect){"
	"$.post({"
		"url: \"/f/t/\" + file_ids + \"/\" + tagselect.val().join(\",\"),"
		"success: function(){"
			"tagselect.val(\"\").change();" // Deselect all
		"},"
		"error: function(){"
			"alert(\"Error tagging file\");"
		"}"
	"});"
"}"

"function filter_f_tbl(selector){"
	"filter_tbl(selector, [1], 2);"
"}"
