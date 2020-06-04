"function column_from_timestamp(selector, timestamp_indx){"
	"$(selector).find('.tr').each(function (i, el){"
		"var $tds = $(this).find('.td');"
		"var $link = $tds.eq(timestamp_indx);"
		"$link.value = $link.text();"
		"$link.text(timestamp2dt($link.value));"
	"});"
"}"
"function column_id2name(var_name, url, selector, fn_name, col){"
	"set_var_to_json_then(var_name, url, function(){"
		"const data = window[var_name];"
		"if (col === undefined){"
			"sub_into(data, document.querySelector(selector), fn_name);"
		"} else {"
			"$(selector).find('.tr').each(function (i, el){"
				"var $tds = $(this).find('.td');"
				"sub_into(data, $tds.eq(col), fn_name);"
			"});"
		"}"
	"});"
"}"
"function filter_tbl(selector, name_col_ids, tags_col_id){"
	"const tbl = document.querySelector(selector);"
	"const headers = tbl.getElementsByClassName('th');"
	
	"var name_regexps = [];"
	"for (const name_col_id of name_col_ids){"
		"const s = (name_col_id === undefined) ? '' : headers[name_col_id].getElementsByTagName('input')[0].value;"
		"name_regexps.push([(s === '') ? undefined : new RegExp(s),  name_col_id]);"
	"}"
	"const tags_regexp_str = (tags_col_id === undefined) ? '' : headers[tags_col_id].getElementsByTagName('input')[0].value;"
	
	"var tags_regexp;"
	"if (tags_regexp_str !== ''){"
		"tags_regexp = new RegExp(tags_regexp_str);"
	"}"
	
	"row_loop: "
	"for (const row of tbl.getElementsByClassName('tbody')[0].getElementsByClassName('tr')){"
		"const cols = row.getElementsByClassName('td');"
		
		"for (const [name_regexp, name_col_id] of name_regexps){"
			"if (name_regexp !== undefined){"
				"const name = cols[name_col_id].textContent;"
				"if (!(name_regexp.test(name))){"
					"row.classList.add('hidden');"
					"continue row_loop;"
				"}"
			"}"
		"}"
		
		"if (tags_regexp !== undefined){"
			"const tags = Array.prototype.slice.call(cols[tags_col_id].getElementsByTagName('a')).map(x => x.textContent).join('\\n');"
			"if (!(tags_regexp.test(tags))){"
				"row.classList.add('hidden');"
				"continue;"
			"}"
		"}"
		
		"row.classList.remove('hidden');"
	"}"
"}"

"function toggle_row_selected(tr){"
	"if (tr.classList.contains(\"selected\")){"
		"tr.classList.remove(\"selected\");"
	"} else {"
		"tr.classList.add(\"selected\");"
	"}"
"}"
"function fancify_tbl(selector){"
	// WARNING: Ensure selector is only for tbody
	"document.querySelector(selector).addEventListener(\"click\", function(e){"
		"var tgt = e.target;"
		
		// Climb the node tree until reach a row (success) - or the body itself (failure)
		"while (tgt !== this  &&  !tgt.classList.contains(\"tr\")) {"
			"tgt = tgt.parentNode;"
		"}"
		
		"if (tgt === this){"
			"alert(\"No table cell found\");"
		"} else {"
			"toggle_row_selected(tgt);"
		"}"
	"});"
"}"

"function getCellValue(tr, idx){"
	"return tr.children[idx].getAttribute('value') || tr.children[idx].innerText || tr.children[idx].textContent"
"}"

"const comparer = (idx, asc) => (a, b) => ("
	"(v1, v2) => "
	"v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)"
")(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));"

"function init_tbls(){"
	"$(\".th\").each(function(i,el){el.addEventListener(\"click\", function(){"
		"const tbl = el.parentNode.parentNode.parentNode.getElementsByClassName(\"tbody\")[0];" // th < tr < thead < table
		"Array.from(tbl.querySelectorAll('.tr:nth-child(n+1)'))"
			".sort(comparer(Array.from(el.parentNode.children).indexOf(el), this.asc = !this.asc))"
			".forEach(tr => tbl.appendChild(tr) );"
	"})})"
"}"

"window.addEventListener(\"load\", function(){"
	"init_tbls();"
"}, false);"
