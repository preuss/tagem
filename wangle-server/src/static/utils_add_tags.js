"function add_tags_dialog(){"
	"hide_all_except(['tagselect-self-p-container','add-tags-dialog']);"
"}"

"function add_tag(){"
	"const queue = document.getElementById('add-tags-queue');"
	"const tag_names = Array.from(queue.getElementsByTagName('ul')).map(x => x.textContent);"
	"if(tag_names.length===0)"
		"return;"
	"const tagselect = $('#tagselect-self-p');"
	"const parent_ids = tagselect.val();"
	"if(parent_ids.length === 0)"
		"return;"
	"$.ajax({"
		"type:\"POST\","
		"url:\"http://localhost:1999/add-t/\" + parent_ids.join(\",\") + \"/\","
		// The trailing slash is to make it slightly easier for the server
		"data:tag_names.join(\"\\n\"),"
		"success:function(){"
			"tagselect.val(\"\").change();"
			"queue.innerHTML = \"\";" // Remove URLs
			"alert(\"Success\");"
			"refetch_json('t', '/a/t.json');"
		"},"
		"dataType:\"text\""
	"});"
"}"

"function add_tags__append(){"
	"const inp = document.getElementById('add-tag-input');"
	"const x = inp.value;"
	"if(x !== \"\")"
		"document.getElementById('add-tags-queue').innerHTML += \"<ul>\" + inp.value + \"</ul>\";"
	"inp.value = \"\";"
"}"