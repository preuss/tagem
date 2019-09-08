#include "box_widget.hpp"
#include "add_new_tag.hpp"
#include <QBrush>
#include <QColor>
#include <QDialog>
#include <QPalette>
#include <QRect>

#include <compsky/mysql/query.hpp>

#include "box_relation.hpp"
#include "box_widget_btn.hpp"
#include "mainwindow.hpp"
#include "name_dialog.hpp"
#include "overlay.hpp"

#include "utils.hpp"


namespace _mysql {
	extern MYSQL* obj;
}

extern char BUF[];


BoxWidget::BoxWidget(QRubberBand::Shape shape,  MainWindow* win,  QWidget* parent)
:
    QRubberBand(shape, parent),  win(win),  parent(parent),  is_expanded(true)
{
    this->relation_btn = new BoxWidgetButton(this, parent, "+Relation");
    this->relation_btn_sz = QSize(this->relation_btn->sizeHint().width(), this->relation_btn->sizeHint().height());
    connect(this->relation_btn, &QPushButton::clicked, this, &BoxWidget::start_relation_line);
    this->relation_btn->show();
    
    this->btn = new BoxWidgetButton(this, parent, "Box");
    this->toggle_expand();
    connect(this->btn, &QPushButton::clicked, this, &BoxWidget::toggle_expand);
    this->btn->show();
}

BoxWidget::~BoxWidget(){
    for (auto iter = this->relations.begin();  iter != this->relations.end();  iter++){
        delete iter->second;
    }
    delete this->relation_btn;  // Only on exit: runtime error: member call on address  which does not point to an object of type 'BoxWidgetButton'
    delete this->btn;  // Only on exit: runtime error: member call on address  which does not point to an object of type 'BoxWidgetButton'
}

void BoxWidget::set_colour(const QColor& cl){
    this->colour = cl;
    QPalette palette;
    palette.setBrush(QPalette::Highlight, QBrush(cl));
    this->setPalette(palette);
    this->update();
}

void BoxWidget::show_text(){
    this->btn->resize(QSize(this->btn->sizeHint().width(), this->btn->sizeHint().height()));
    this->btn->show();
}

void BoxWidget::setGeometry(const QRect& r){
    this->geometry = r;
    this->btn->move(this->geometry.topLeft());
    this->relation_btn->move(this->geometry.topRight()  -  QPoint(this->relation_btn_sz.width() - 1,  0));
    // Keep button entirely inside this widget - not only visually nicer, but avoids issue when widget borders the right edge of the window's main_widget.
    QRubberBand::setGeometry(r);
}

void BoxWidget::toggle_expand(){
    if (this->is_expanded)
        this->btn->setText("Box");
    else
        this->btn->setText(this->tags.join("\n"));
    this->show_text();
    this->is_expanded = !this->is_expanded;
};

void BoxWidget::start_relation_line(){
    this->win->start_relation_line(this);
}
void BoxWidget::add_relation_line(BoxWidget* iw){
    if (this->relations[iw])
        return;
    QPoint middle = (this->geometry.topRight() + iw->geometry.topLeft()) / 2;
    
    compsky::mysql::exec(_mysql::obj,  BUF,  "INSERT INTO relation (master_id, slave_id) VALUES(",  this->id,  ',',  iw->id,  ')');
    const uint64_t _relation_id = get_last_insert_id();
	
	BoxRelation* ir = new BoxRelation(_relation_id, middle, this->win, this->parent);
    this->win->main_widget_overlay->do_not_update_boxes = true;
    
    // Seems to avoid segfault - presumably because the tagdialog forces a paintEvent of the overlay
    while(true){
		const uint64_t tagid = ask_for_tag();
		if (tagid == 0)
			break;
        compsky::mysql::exec(_mysql::obj,  BUF,  "INSERT IGNORE INTO relation2tag (relation_id, tag_id) VALUES(", ir->id, ',', tagid, ')');
    }
    this->win->main_widget_overlay->do_not_update_boxes = false;
    this->relations[iw] = ir;
    this->win->main_widget_overlay->update();
}