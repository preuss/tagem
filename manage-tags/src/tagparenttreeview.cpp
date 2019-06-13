#include "tagparenttreeview.hpp"

#include <QByteArray>
#include <QString>

#include <compsky/mysql/query.hpp>

#include "tagchildtreeview.hpp"
#include "tagtreemodel.hpp"
#include "unpackaged_utils.hpp" // for ascii_to_uint64


extern MYSQL_RES* RES;


TagParentTreeView::TagParentTreeView(TagChildTreeView* tag_child_tree_view,  QWidget* parent)
:
    tag_child_tree_view(tag_child_tree_view),
    TagTreeView(false, parent)
{
    connect(tag_child_tree_view->selectionModel(), &QItemSelectionModel::selectionChanged, this, &TagParentTreeView::set_root);
    
    //connect(tag_child_tree_view.selectionModel(), QItemSelectionModel::selectionChanged(const QItemSelection&, const QItemSelection&), &TagParentTreeView::selectionChanged, this, SLOT(set_root()));
    
    this->setSelectionBehavior(this->SelectRows);
    this->setSelectionMode(this->SingleSelection);
    this->setDragDropOverwriteMode(false);
};

void TagParentTreeView::set_root(const QItemSelection& selected,  const QItemSelection& deselected){
    TagTreeModel* mdl = (TagTreeModel*)this->model();
    mdl->tag2entry.clear(); // Not unnecessary
    mdl->tag2parent.clear();
    this->init_headers();
    
    for (auto i = 0;  i < mdl->rowCount();  ++i)
        mdl->removeRow(0);
    
    auto indx = selected.indexes()[0]; // TODO: Allow display of multiple heirarchies (drag to select multiple)
    
    QString a = indx.sibling(indx.row(), 0).data().toString();
    QByteArray b = a.toLocal8Bit();
    const char* tag_id_str = b.data();
    compsky::mysql::exec("CALL ancestor_tags_id_rooted_from_id(\"tmp_tag_parents\", ", tag_id_str, ')');
    compsky::mysql::query_buffer(&RES, "SELECT node, parent, -1, name FROM tmp_tag_parents JOIN tag ON id=parent WHERE node");
    
    this->place_tags(ascii_to_uint64(tag_id_str));
};
