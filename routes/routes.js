require('dotenv').config()
const {Participant, Group} = require('../sequelize')
var express = require('express')
var router = express.Router()
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_SMTP,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
}));


router.get('/', async (req, res) => {
  let part = await Participant.findAll().then(
      part => res.render('index', {participants: part}))


});

// show all groups
router.get('/admin/groups', async (req, res) => {
  let groups = await Group.findAll();
  res.render('groups', {groups: groups});
})

//show group details
router.get('/admin/groups/:id', async (req, res) => {
  const id = req.params.id;
  let group = await Group.findOne({
    where: {
      id: id
    }
  });
  let participants = await Participant.findAll({
    where: {
      groupId: id
    }
  });
  res.render('groupDetail', {group, participants});
})

//generate group pair
router.get('/admin/groups/:id/generate', async (req, res) => {
  const id = req.params.id;
  let group = await Group.findOne({
    where: {
      id: id
    }
  });
  let participants = await Participant.findAll({
    where: {
      groupId: id
    }
  });
  let thematches = [];
  for (const [key, value] of match(participants).entries()) {
    let html = process.env.EMAIL_TEMPLATE
    .replace(/{host}/g, process.env.HOST)
    .replace(/{sender}/g, key.name)
    .replace(/{email}/g, value.email)
    .replace(/{name}/g, value.name)
    .replace(/{address}/g, value.address)
    .replace(/{wish}/g, value.wish)
    .replace(/{phone}/g, value.phone);
    await transporter.sendMail({
      from: 'santa@kostadinovski.info',
      to: key.email,
      subject: 'Secret santa email gift :) ',
      html: html
    }).then(() => {
      console.log('sent to : ' + key.email)
    }).catch((err) => {
      console.log(err);
    })
    thematches.push({key,value})
  }
  res.render('groupMatch', {match:thematches, participants});
})

//get form for participant registration for group
router.get('/admin/groups/:id/registerParticipant', async (req, res) => {
  const id = req.params.id;
  let group = await Group.findOne({
    where: {
      id: id
    }
  });
  res.render('registerParticipant', {group});
})

//register participant for group
router.post('/admin/groups/register', async (req, res) => {
  let create = await Participant.create(req.body)
  res.render('thankYou')
});

// register group
router.post('/admin/registerGroup', async (req, res) => {
  let create = await Group.create({
    name: req.body.name
  })
  res.redirect('/admin/groups').end();
});


function match(people){
  if(people.length < 3) {
    throw new Error('Only works with three or more persons');
  }

  if(people.length !== new Set(people).size) {
    throw new Error('Duplicate person(s) in the input.');
  }

  const res = new Map;

  people.sort(_ => Math.random() - .5);

  for (let i = 0; i < people.length; i++) {
    res.set(people[i], people[(i + 1) % people.length]);
  }

  return res;
}
module.exports = router
