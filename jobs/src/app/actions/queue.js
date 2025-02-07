import Queue from 'app/lib/queue';

export default {
  add: (name) => (req, res) => {
    let data = req.body;
    data.files = req.files || [];
    Queue.add(name, data);
    res.json(data);
  }
}
