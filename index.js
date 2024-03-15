const express = require("express"); 
const Sequelize = require("sequelize").Sequelize;
const QueryTypes = require("sequelize").QueryTypes;
const bcrypt = require("bcrypt");
const connection = require("./src/config/config.json");
const session = require("express-session");
const flash = require("express-flash");


//create instance sequelize connection
const sequelizeConfig = new Sequelize(connection.development);

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); //middleware utk kirim data ke server lewat html (method post)

app.use(express.static("public"));

app.use(flash())
app.use(session({
  secret: "rahasia",
  store: new session.MemoryStore(),
  cookie: { 
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: false 
  },
  saveUninitialized: true,
  resave: false
}))

app.set("view engine", "ejs");

app.get("/", index);
app.get("/addproject", addProject);
app.post("/addproject", addProjectPost);
app.get("/contactme", contactMe);
app.get("/deletepost/:id", deletePost);
app.get("/editblogget/:id", editBlogget);
app.post("/editblogpost/:id", editBlogPost);
app.get("/register", register);
app.post("/register", registerPost);
app.get("/login", login);
app.post("/login", loginPost);
app.get("/logout", logout);
app.get('/detailpost/:id', detailPost);

let datas = [];

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


async function index(req, res) {
  try {
    const QueryName = "SELECT * FROM public.tb_projects";

    const blog = await sequelizeConfig.query(QueryName, {type: QueryTypes.SELECT,});
    blog.map(data => {
      const startDateInput = new Date(data.start_date)
      const endDateInput = new Date(data.end_date)

      const startYear = startDateInput.getFullYear(); //ambil tahun awal (number)
      const startMonth = startDateInput.getMonth(); //ambil bulan awal (number)
      const endYear = endDateInput.getFullYear(); //ambil tahun akhir (number)
      const endMonth = endDateInput.getMonth(); //ambil tahun akhir (number)

      let getDurationMonth = (endYear - startYear) * 12 + (endMonth - startMonth)
      let getDuration = ''

      //pengecekan apakah durasi masuk kategori hari atau bulan
      if (getDurationMonth == 0) {
        let getDurationDay = endDateInput.getTime() - startDateInput.getTime();
      getDuration += Math.ceil(getDurationDay / (1000 * 3600 * 24)) + " hari";
      } else if (getDurationMonth > 0) {
        getDuration += getDurationMonth + " bulan";
      }

      datas.push(
        {
          id: data.id,
          name: data.name,
          getDuration,
          description: data.description,
          image: data.image,
          technologies : data.technologies
        }
      )
    })

    // console.log(datas)
    res.render("index", { 
      datas,
      isLogin: req.session.isLogin,
      user: req.session.user
     });
    datas = []
  } catch (error) {
    console.log(error.message)
  }
}
function addProject(req, res) {
  res.render("addproject");
}
async function addProjectPost(req, res) {
  try {
    const {
      nameProject,
      startDate,
      endDate,
      description,
      node,
      vue,
      react,
      php,
    } = req.body;

    const techStackFiltering = [];
    node == "node"
      ? techStackFiltering.push(
          '<i class="fa-brands fa-node-js m-2" style="font-size: 1.5rem; "></i>'
        )
      : "";
    vue == "vue"
      ? techStackFiltering.push(
          '<i class="fa-brands fa-vuejs m-2" style="font-size: 1.5rem; "></i>'
        )
      : "";
    react == "react"
      ? techStackFiltering.push(
          '<i class="fa-brands fa-react m-2" style="font-size: 1.5rem;"></i>'
        )
      : "";
    php == "php"
      ? techStackFiltering.push(
          '<i class="fa-brands fa-php m-2" style="font-size: 1.5rem;"></i>'
        )
      : "";

    const image = "gambar";
    const queryName = `INSERT INTO public.tb_projects (name, start_date, end_date, description, image, "createdAt", "updatedAt", technologies) 
    VALUES ('${nameProject}', '${startDate}', '${endDate}', '${description}', '${image}', NOW(), NOW(), ARRAY[${techStackFiltering.map(tech => `'${tech}'`).join(', ')}]);`;

    const blog = await sequelizeConfig.query(queryName);
    // console.log(blog);
    datas = []
    res.redirect("/");
  } catch (error) {
    console.log(error.message)
  }

}

async function deletePost(req, res) {
  try {
    const queryName = `DELETE FROM public.tb_projects WHERE id = ${req.params.id}`;
    await sequelizeConfig.query(queryName);
    datas = []
    res.redirect("/");
  } catch (error) {
    console.log(error.message)
  }
console.log(datas)
}

 async function editBlogPost(req, res) {
  try {
  const {nameProject, startDate, endDate, description, node, vue, react, php } = req.body

  const techStackFiltering = [];
    node == "node"
      ? techStackFiltering.push(
          '<i class="fa-brands fa-node-js m-2" style="font-size: 1.5rem; "></i>'
        )
      : "";
    vue == "vue"
      ? techStackFiltering.push(
          '<i class="fa-brands fa-vuejs m-2" style="font-size: 1.5rem; "></i>'
        )
      : "";
    react == "react"
      ? techStackFiltering.push(
          '<i class="fa-brands fa-react m-2" style="font-size: 1.5rem;"></i>'
        )
      : "";
    php == "php"
      ? techStackFiltering.push(
          '<i class="fa-brands fa-php m-2" style="font-size: 1.5rem;"></i>'
        )
      : "";

      const image = 'gambar'
      const queryName = `UPDATE public.tb_projects 
      SET name='${nameProject}', start_date='${startDate}', end_date='${endDate}', description='${description}', image='${image}', "createdAt"=NOW(), "updatedAt"=NOW(), "technologies"=ARRAY[${techStackFiltering.map(tech => `'${tech}'`).join(', ')}] 
      WHERE id = ${req.params.id}`;

      const blog = await sequelizeConfig.query(queryName, { type: QueryTypes.UPDATE });
      console.log(blog);
      // console.log(techSta  ckFiltering);
      res.redirect("/");

    } catch (error) {
      console.log(error.message)
      
    }
}

async function editBlogget(req,res) {
  try {
    const id = req.params.id
    const queryName = `SELECT * FROM public.tb_projects WHERE id= ${id}`;
    const result = await sequelizeConfig.query(queryName, { type: QueryTypes.SELECT });
    
    if(result.length > 0) {
      const projectData = result[0]
      console.log(projectData.technologies)
      let techcheckbox = {
        node : false,
        vue : false,
        react : false,
        php : false,
      }
      let newArr = []
      for( let i = 0; i<projectData.technologies.length; i++) {
        if(projectData.technologies[i] == '<i class="fa-brands fa-node-js m-2" style="font-size: 1.5rem; "></i>') {
          techcheckbox.node = true
        }else if(projectData.technologies[i] == '<i class="fa-brands fa-vuejs m-2" style="font-size: 1.5rem; "></i>'){
          techcheckbox.vue = true
        }else if(projectData.technologies[i] == '<i class="fa-brands fa-react m-2" style="font-size: 1.5rem;"></i>') {
          techcheckbox.react = true
        }else if(projectData.technologies[i] == '<i class="fa-brands fa-php m-2" style="font-size: 1.5rem;"></i>'){
          techcheckbox.php = true
        }
      }
      // console.log(techcheckbox.node)
      res.render('editblog', { id, projectData, techcheckbox })
    }
    
  } catch (error) {
    console.log(error.message)
  }
  
}

function contactMe(req, res) {
  res.render("contactme");
}

function register(req, res){
  res.render('register')
}

async function registerPost(req, res){
  try {
    const {name, email, password} = req.body
    if(password.length < 8){
      req.flash("danger", "Password must be at least 8 characters")
      return res.redirect('/register')
    }
    bcrypt.hash(password, 10, async(err, hash) => {
      if(err) {
        res.redirect('/register')
      }else{
        await sequelizeConfig.query(`INSERT INTO public."Users" (name, email, password, "createdAt", "updatedAt") VALUES ('${name}', '${email}', '${hash}', NOW(), NOW());`)
        res.redirect('/login') 
      }
    })
  } catch (error) {
    console.log(error.message)
  }
}

function login(req, res){
  res.render('login')
}

async function loginPost(req, res) {
  try {
    const {email, password} = req.body
    const queryName = `SELECT * FROM public."Users" WHERE email = '${email}'`
    const ischeckEmail = await sequelizeConfig.query(queryName, {type: QueryTypes.SELECT});

    if( !ischeckEmail.length ) {
      req.flash("danger", "Email has not been registered")
      return res.redirect('/login')
    }

    await bcrypt.compare(password,ischeckEmail[0].password, (err, result) => {
      if(!result){
        req.flash('danger', 'Password Wrong')
        return res.redirect('/login')
      } else {
        req.session.isLogin = true
        req.session.user = ischeckEmail[0].name
        req.flash('success', 'Login Success')
        return res.redirect('/')
      }
    })

  } catch (error) {
    console.log(error.message)
  }
}

function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error(err.message);
    } else {
      res.redirect('/login'); 
    }
  });
}

async function detailPost(req, res) {

  try {
    const QueryName = `SELECT * FROM public.tb_projects WHERE id= ${req.params.id}`

    const blog = await sequelizeConfig.query(QueryName, {type: QueryTypes.SELECT,});
    console.log(blog)

      const startDateInput = new Date(blog[0].start_date)
      const endDateInput = new Date(blog[0].end_date)

      const startYear = startDateInput.getFullYear(); //ambil tahun awal (number)
      const startMonth = startDateInput.getMonth(); //ambil bulan awal (number)
      const endYear = endDateInput.getFullYear(); //ambil tahun akhir (number)
      const endMonth = endDateInput.getMonth(); //ambil tahun akhir (number)

      let getDurationMonth = (endYear - startYear) * 12 + (endMonth - startMonth)
      let getDuration = ''

      //pengecekan apakah durasi masuk kategori hari atau bulan
      if (getDurationMonth == 0) {
        let getDurationDay = endDateInput.getTime() - startDateInput.getTime();
      getDuration += Math.ceil(getDurationDay / (1000 * 3600 * 24)) + " hari";
      } else if (getDurationMonth > 0) {
        getDuration += getDurationMonth + " bulan";
      }
      
res.render('detailpost', {blog, getDuration})
  } catch (error) {
    console.log(error.message)
  }

}