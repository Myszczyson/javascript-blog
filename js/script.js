const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author'

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  console.log('clickedElement (with plus): ' + clickedElement);
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
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  console.log(customSelector)

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
    /* find the title element */
    const articleId = article.getAttribute('id');
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    /* insert link into titleList */
    html = html + linkHTML;
    console.log(html);
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
    for(let link of links){
    link.addEventListener('click', titleClickHandler);
}
}

generateTitleLinks();



function generateTags(){
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
    console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      console.log(tag);
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
  /* END LOOP: for every article: */
  }
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
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const author  = article.querySelector(optArticleAuthorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const authorTags = article.getAttribute('data-author');
    /* START LOOP: for each tag */
    for(let authorTag of authorTags){
      /* add generated code to html variable */
      html = html + authorTag;
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    author.innerHTML = '<a href="#tag-' + html + '">' + html + '</a>';
  /* END LOOP: for every article: */
  }
}

generateAuthors ();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const authorHref = clickedElement.getAttribute('href');
  const selectedAuthorHref = authorHref.replace('#tag-', '');
  const activeAuthorTags = document.querySelectorAll('.post-author a.active[href^="#tag-"]');
  for(let activeAuthorTag of activeAuthorTags){
    activeAuthorTag.classList.remove('active');
  }
  const hrefAuthorTags = document.querySelectorAll('.post-author a[href="' + authorHref + '"]');
  for(let hrefAuthorTag of hrefAuthorTags){
    hrefAuthorTag.classList.add('active');
  }
  generateTitleLinks('[data-author="' + selectedAuthorHref + '"]');
}

function addClickListenersToAuthors(){
  const authorLinks = document.querySelectorAll('.post-author a[href^="#tag-"]');
  for(let authorLink of authorLinks){
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
