const FAQ = require('../models/FAQ');

exports.getFAQs = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.$or = [
      { question: { $regex: search, $options: 'i' } },
      { answer: { $regex: search, $options: 'i' } }
    ];
    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching FAQs' });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating FAQ' });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating FAQ' });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting FAQ' });
  }
};
