const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((result) => res.status(201).send({ data: result }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      }
      next(error);
    });
};

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((article) => {
      if (article.length === 0) {
        throw new NotFoundError('Статьи не найдены');
      }
      res.send({ data: article });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Невалидный id пользователя'));
      }
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Статья не найдена');
      } else if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для совершения действия');
      } else {
        Article.findByIdAndRemove(req.params.articleId)
          .then((result) => {
            if (!result) {
              throw new NotFoundError('Статья не найдена');
            }
            res.send({ data: result });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  createArticle,
  getArticles,
  deleteArticle,
};
