const mysql = require("mysql2");
const express = require("express");


const app = express();
const urlencodedParser = express.urlencoded({extended: false});

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "usersdb2",
    password: "plEzENE8"
});

app.set("view engine", "hbs");

// получение списка транспортных средств и вывод их на страницу auto
app.get("/auto", function(req, res){
    pool.query("SELECT * FROM auto", function(err, data) {
        if(err) return console.log(err);
        res.render("auto.hbs", {
            auto: data
        });
    });
});


// получение списка транспортных средств и вывод их на страницу auto
app.get("/employees", function(req, res){
    pool.query("SELECT * FROM employees", function(err, data) {
        if(err) return console.log(err);
        res.render("employees.hbs", {
            employees: data
        });
    });
});


// получение списка запасных частей и вывод их на страницу auto
app.get("/parts", function(req, res){
    pool.query("SELECT * FROM parts", function(err, data) {
        if(err) return console.log(err);
        res.render("parts.hbs", {
            parts: data
        });
    });
});


// получение списка услуг и вывод их на страницу auto
app.get("/service", function(req, res){
    pool.query("SELECT * FROM service", function(err, data) {
        if(err) return console.log(err);
        res.render("service.hbs", {
            service: data
        });
    });
});



//рендер главной страницы
app.get("/", function(req, res){
        res.render("index.hbs");
});

/*
// возвращаем форму для добавления данных
app.get("/create", function(req, res){
    res.render("create.hbs");
});
*/

// возвращаем ссылки на просмотр доступных справочников
app.get("/tables", function(req, res){
    res.render("tables.hbs");
});

// возвращаем на страницу выбор редактированя или просмотра авто
app.get("/auto", function(req, res){
    res.render("auto.hbs");
});

// возвращаем на страницу добвание нового авто
app.get("/auto_add", function(req, res){
    res.render("auto_add.hbs");
});

// получение списка транспортных средств и вывод их на страницу auto




// получаем отправленные данные о транспортном средстве и добавляем их в БД
app.post("/auto_add", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const model = req.body.model;
    const mileage = req.body.mileage;
    const board_number = req.body.board_number;
    const number_plate = req.body.number_plate;
    const vin = req.body.vin;

    pool.query("INSERT INTO auto (model, mileage,board_number,number_plate,vin) VALUES (?,?,?,?,?)", [model, mileage, board_number,number_plate,vin], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/auto");
    });
});


// получем id редактируемого транспортного средства, получаем его из бд и отправлям с формой редактирования
app.get("/auto_edit/:id", function(req, res){
    const id = req.params.id;
    pool.query("SELECT * FROM auto WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.render("auto_edit.hbs", {
            auto: data[0]
        });
    });
});
// получаем отредактированные данные транспортного средства и отправляем их в БД
app.post("/auto_edit", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const model = req.body.model;
    const mileage = req.body.mileage;
    const board_number = req.body.board_number;
    const number_plate = req.body.number_plate;
    const vin = req.body.vin;
    const id = req.body.id;

    pool.query("UPDATE auto SET model=?, mileage=?,board_number=?,number_plate=?,vin=? WHERE id=?", [model, mileage, board_number,number_plate,vin, id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/auto");
    });
});
// получаем id удаляемого транспорного и удаляем его из бд
app.post("/auto_delete/:id", function(req, res){

    const id = req.params.id;
    pool.query("DELETE FROM auto WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/auto");
    });
});



// возвращаем на страницу выбор редактированя или просмотра сотрудника
app.get("/employees", function(req, res){
    res.render("employees.hbs");
});
//рендер страницы добавления сотрудника
app.get("/employees_add", function(req, res){
    res.render("employees_add.hbs");
});

// получаем отправленные данные о сотруднике и добавляем их в БД
app.post("/employees_add", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const job_title = req.body.job_title;
    pool.query("INSERT INTO employees (first_name, last_name,job_title) VALUES (?,?,?)", [first_name, last_name, job_title], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/employees");
    });
});
// получем id редактируемого сотрудника, получаем его из бд и отправлям с формой редактирования
app.get("/employees_edit/:id", function(req, res){
    const id = req.params.id;
    pool.query("SELECT * FROM employees WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.render("employees_edit.hbs", {
            employees: data[0]
        });
    });
});
// получаем отредактированные данные сотрудника  и отправляем их в БД
app.post("/employees_edit", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const job_title = req.body.job_title;
    const id = req.body.id;

    pool.query("UPDATE employees SET first_name=?, last_name=?,job_title=? WHERE id=?", [first_name, last_name, job_title, id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/employees");
    });
});
// получаем id удаляемого cотрудника и удаляем его из бд
app.post("/employees_delete/:id", function(req, res){

    const id = req.params.id;
    pool.query("DELETE FROM employees WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/employees");
    });
});





/*
запасные части
 */
// рендер страницы редактированя или просмотра запчастей
app.get("/parts", function(req, res){
    res.render("parts.hbs");
});
//рендер страницы добавления запчастей
app.get("/parts_add", function(req, res){
    res.render("parts_add.hbs");
});
// получаем отправленные данные о запчасти и добавляем их в БД
app.post("/parts_add", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const part_number = req.body.part_number;
    pool.query("INSERT INTO parts (name, part_number) VALUES (?,?)", [name, part_number], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/parts");
    });
});
// получем id редактируемой запчасти, получаем его из бд и отправлям с формой редактирования
app.get("/parts_edit/:id", function(req, res){
    const id = req.params.id;
    pool.query("SELECT * FROM parts WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.render("parts_edit.hbs", {
            parts: data[0]
        });
    });
});
// получаем отредактированные данные сотрудника  и отправляем их в БД
app.post("/parts_edit", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const part_number = req.body.part_number;
    const id = req.body.id;

    pool.query("UPDATE parts SET name=?, part_number=? WHERE id=?", [name, part_number, id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/parts");
    });
});
// получаем id удаляемой запчасти удаляем его из бд
app.post("/parts_delete/:id", function(req, res){

    const id = req.params.id;
    pool.query("DELETE FROM parts WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/parts");
    });
});






/*
Услуги
*/

// рендер страницы редактированя или просмотра услуг
app.get("/service", function(req, res){
    res.render("service.hbs");
});

//рендер страницы добавления услуг
app.get("/service_add", function(req, res){
    res.render("service_add.hbs");
});
// получаем отправленные данные об услуге и добавляем их в БД
app.post("/service_add", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const maintenance_type = req.body.maintenance_type;
    pool.query("INSERT INTO service (name, maintenance_type) VALUES (?,?)", [name, maintenance_type], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/service");
    });
});

// получем id редактируемой услуги, получаем его из бд и отправлям с формой редактирования
app.get("/service_edit/:id", function(req, res){
    const id = req.params.id;
    pool.query("SELECT * FROM service WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.render("service_edit.hbs", {
            service: data[0]
        });
    });
});

// получаем отредактированные данные услуги  и отправляем их в БД
app.post("/service_edit", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const maintenance_type = req.body.maintenance_type;
    const id = req.body.id;

    pool.query("UPDATE service SET name=?, maintenance_type=? WHERE id=?", [name, maintenance_type, id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/service");
    });
});


// получаем id удаляемой запчасти удаляем его из бд
app.post("/service_delete/:id", function(req, res){

    const id = req.params.id;
    pool.query("DELETE FROM service WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/service");
    });
});




/*
tests
 */

// рендер страницы при поииске услуг
app.post("/service_search/", urlencodedParser, function (req, res) {
    const service_search = req.body.serviceSearch+'%';
    console.log();
    pool.query(`SELECT * FROM service WHERE name LIKE ?`, [service_search], function(err, data) {
        if(err) return console.log(err);
        res.render("service.hbs", {
            service: data
        });
    });
 });



/*


*/



app.listen(80, function(){
    console.log("Сервер ожидает подключения...");
});