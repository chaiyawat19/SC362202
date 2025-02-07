const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;

class App extends React.Component {
  // Title and footer for the card
  title = (
    <Alert variant="info">
      <b>Work6 :</b> Firebase
    </Alert>
  );

  footer = (
    <div>
      By 663380195-2 นายไชยวัฒน์ โสนะชัย <br />
      College of Computing, Khon Kaen University
    </div>
  );

  // Initial state setup
  state = {
    scene: 0,
    students: [],
    user: null,
    stdid: "",
    stdtitle: "",
    stdfname: "",
    stdlname: "",
    stdemail: "",
    stdphone: "",
  };

  constructor() {
    super();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        this.setState({ user: null });
      }
    });
  }

  // Google login
  google_login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase.auth().signInWithPopup(provider);
  }

  // Google logout
  google_logout() {
    if (confirm("Are you sure?")) {
      firebase.auth().signOut();
    }
  }

  // Read data from Firestore
  readData() {
    db.collection("students").get().then((querySnapshot) => {
      var stdlist = [];
      querySnapshot.forEach((doc) => {
        stdlist.push({ id: doc.id, ...doc.data() });
      });
      console.log(stdlist);
      this.setState({ students: stdlist });
    });
  }

  // Auto read data from Firestore
  autoRead() {
    db.collection("students").onSnapshot((querySnapshot) => {
      var stdlist = [];
      querySnapshot.forEach((doc) => {
        stdlist.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ students: stdlist });
    });
  }

  // Insert or update student data
  insertData() {
    db.collection("students").doc(this.state.stdid).set({
      title: this.state.stdtitle,
      fname: this.state.stdfname,
      lname: this.state.stdlname,
      phone: this.state.stdphone,
      email: this.state.stdemail,
    });
    alert("เพิ่ม/แก้ไขข้อมูลสำเร็จ");
    this.readData(); 
  }

  // Edit student data
  edit(std) {
    this.setState({
      stdid: std.id,
      stdtitle: std.title,
      stdfname: std.fname,
      stdlname: std.lname,
      stdemail: std.email,
      stdphone: std.phone,
    });
  }

  // Delete student data
  delete(std) {
    if (window.confirm("ต้องการลบข้อมูล?")) {
      db.collection("students").doc(std.id).delete()
        .then(() => {
          alert("ลบข้อมูลสำเร็จ");
          this.readData(); 
        })
        .catch((error) => {
          alert("เกิดข้อผิดพลาดในการลบข้อมูล: " + error);
        });
    }
  }

  render() {
    return (
      <Card>
        <Card.Header>{this.title}</Card.Header>
        <LoginBox user={this.state.user} app={this} />
        <Card.Body>
          {this.state.user ? ( // ถ้าล็อกอินแล้ว ให้แสดง UI ของ StudentTable และ Form
            <>
              <div className="d-flex gap-3">
                <Button
                  variant="primary"
                  className="px-4 py-2 shadow-sm border-0 rounded-pill"
                  onClick={() => this.readData()}
                >
                  Read Data
                </Button>
                <Button
                  variant="success"
                  className="px-4 py-2 shadow-sm border-0 rounded-pill"
                  onClick={() => this.autoRead()}
                >
                  Auto Read
                </Button>
              </div>

              <div style={{ marginTop: '20px' }}>
                <StudentTable data={this.state.students} app={this} />
              </div>

              <Card.Footer>
                <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br />
                <TextInput label="ID" app={this} value="stdid" style={{ width: 120 }} />
                <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{ width: 100 }} />
                <TextInput label="ชื่อ" app={this} value="stdfname" style={{ width: 120 }} />
                <TextInput label="สกุล" app={this} value="stdlname" style={{ width: 120 }} />
                <TextInput label="Email" app={this} value="stdemail" style={{ width: 150 }} />
                <TextInput label="Phone" app={this} value="stdphone" style={{ width: 120 }} />
                <Button onClick={() => this.insertData()}>Save</Button>
              </Card.Footer>
            </>
          ) : ( // ถ้ายังไม่ได้ล็อกอิน ให้แสดงแค่ LoginBox
            <Card.Body>
              <p>กรุณาเข้าสู่ระบบเพื่อดูข้อมูลนักศึกษา</p>
            </Card.Body>
          )}
        </Card.Body>
        <Card.Footer>{this.footer}</Card.Footer>
      </Card>
    );
  }
}

function LoginBox({ user, app }) {
  if (!user) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <Button variant="primary" className="px-4 py-2 shadow-sm" onClick={() => app.google_login()}>
          Login with Google
        </Button>
      </div>
    );
  } else {
    return (
      <Card className="p-3 shadow-lg rounded d-flex flex-row align-items-center gap-3">
        <img
          src={user.photoURL}
          alt="User Profile"
          className="rounded-circle border border-2"
          width={50}
          height={50}
        />
        <div className="flex-grow-1">
          <p className="mb-0 fw-bold">{user.email}</p>
        </div>
        <Button variant="danger" className="px-3 py-1 shadow-sm" onClick={() => app.google_logout()}>
          Logout
        </Button>
      </Card>
    );
  }
}

function DeleteButton({ std, app }) {
  return (
    <Button variant="danger" className="px-3 py-1 shadow-sm" onClick={() => app.delete(std)}>
      <i className="fas fa-trash-alt"></i> ลบ
    </Button>
  );
}

function EditButton({ std, app }) {
  return (
    <Button variant="warning" className="px-3 py-1 shadow-sm text-dark" onClick={() => app.edit(std)}>
      <i className="fas fa-edit"></i> แก้ไข
    </Button>
  );
}

function TextInput({ label, app, value }) {
  return (
    <div className="card p-3 mb-3 shadow-lg rounded">
      <label className="form-label fw-bold">{label}</label>
      <input
        type="text"
        className="form-control border-0 shadow-sm"
        placeholder={`กรอก ${label}`}
        value={app.state[value]}
        onChange={(ev) => {
          let s = {};
          s[value] = ev.target.value;
          app.setState(s);
        }}
      />
    </div>
  );
}

function StudentTable({ data, app }) {
  return (
    <Table striped bordered hover className="text-center">
      <thead className="table-dark">
        <tr>
          <th>รหัส</th>
          <th>คำนำหน้า</th>
          <th>ชื่อ</th>
          <th>สกุล</th>
          <th>Email</th>
          <th>Phone</th>
          <th>แก้ไข</th>
          <th>ลบ</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.title}</td>
            <td>{s.fname}</td>
            <td>{s.lname}</td>
            <td>{s.email}</td>
            <td>{s.phone}</td>
            <td>
              <EditButton std={s} app={app} />
            </td>
            <td>
              <DeleteButton std={s} app={app} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const firebaseConfig = {
  apiKey: "AIzaSyBiANN2SzixiiH591cSTjCzxyDRnMgVIAE",
  authDomain: "work6sc362202.firebaseapp.com",
  projectId: "work6sc362202",
  storageBucket: "work6sc362202.firebasestorage.app",
  messagingSenderId: "829345366379",
  appId: "1:829345366379:web:652d2f6212450aaa164c2e",
  measurementId: "G-ZPMSVVKD7C"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
