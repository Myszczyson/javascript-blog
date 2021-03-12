const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorCloudClassCount = 4,
  optAuthorCloudClassPrefix = 'author-size-';

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');
  }
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
    /* find the title element */
    const articleId = article.getAttribute('id');
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
    for(let link of links){
    link.addEventListener('click', titleClickHandler);
}
}

generateTitleLinks();

function calculateTagsParams(tags){
  const params = {
    max: 0,
    min: 999999
  }
  for(let tag in tags){
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const tagList  = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags')
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  let allTagsData = {tags: []}
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    })
  }
  /* [NEW] END LOOP: for each tag in allTags: */
  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags){
    /* remove class active */
    activeTag.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const hrefTags = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let hrefTag of hrefTags){
    /* add class active */
  hrefTag.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const linkTags = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let linkTag of linkTags){
    /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors(){
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const author  = article.querySelector(optArticleAuthorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const authorTag = article.getAttribute('data-author');
    /* generate author html */
    const authorHTMLData = {id: authorTag, title: authorTag};
    const authorHTML = templates.authorLink(authorHTMLData);
    /* add generated code to html variable */
    html = html + authorHTML;
      /* END LOOP: for each tag */
      if(!allAuthors[authorTag]) {
        /* [NEW] add generated code to allTags array */
        allAuthors[authorTag] = 1
      } else {
        allAuthors[authorTag]++;
      }
    /* insert HTML of all the links into the tags wrapper */
    author.innerHTML = html
  /* END LOOP: for every article: */
  }
  const authorsList = document.querySelector('.authors')
  /* [NEW] create variable for all links HTML code */
  const authorsParams = calculateAuthorsParams(allAuthors);
  let allAuthorsData = {authors: []}
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let author in allAuthors){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    const authorLinkHTML = '<li><a class="' + calculateAuthorsClass(allAuthors[author], authorsParams) + '" href="#tag-' + author + '">'+ author +'</a> ('+ allAuthors[author] +')</li>';
    allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateAuthorsClass(allAuthors[author], authorsParams)
    })
  }
  /* [NEW] END LOOP: for each tag in allTags: */
  /*[NEW] add HTML from allTagsHTML to tagList */
  authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);
}

function calculateAuthorsParams(authors){
  const params = {
    max: 0,
    min: 999999
  }
  for(let author in authors){
    params.max = Math.max(authors[author], params.max);
    params.min = Math.min(authors[author], params.min);
  }
  return params;
}

function calculateAuthorsClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optAuthorCloudClassCount - 1) + 1 );
  return optAuthorCloudClassPrefix + classNumber
}

generateAuthors ();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const authorHref = clickedElement.getAttribute('href');
  const selectedAuthorHref = authorHref.replace('#tag-', '');
  const activeAuthorTags = document.querySelectorAll('.post-author a.active[href^="#tag-"], .authors li a.active[href^="#tag-"]');
  console.log(activeAuthorTags)
  for(let activeAuthorTag of activeAuthorTags){
    activeAuthorTag.classList.remove('active');
  }
  const hrefAuthorTags = document.querySelectorAll('.post-author a[href="' + authorHref + '"], .authors li a[href="' + authorHref + '"]');
  for(let hrefAuthorTag of hrefAuthorTags){
    hrefAuthorTag.classList.add('active')
  }
  generateTitleLinks('[data-author="' + selectedAuthorHref + '"]');
}

function addClickListenersToAuthors(){
  const authorLinks = document.querySelectorAll('.post-author a[href^="#tag-"], .authors li a[href^="#tag-"]');
  for(let authorLink of authorLinks){
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
