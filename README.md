# trygit
try git advanced practice

## todo
* learn GIT
* learn Markdown


# routing

'sitename.dom' - start page
  have links at 'sitename.dom/u/login'

ADMIN PAGES
'sitename.dom/a/*' - for admin area reserved
// 'sitename.dom/a/login' ==> 'sitename.dom/u/login'
// 'sitename.dom/a/logout' ==> 'sitename.dom/u/logout'
'sitename.dom/a/info' - common info about whole site
'sitename.dom/a/info?u=%user_id%' - info about users by user_id
'sitename.dom/a/info?l=%link_id%' - info about links by link_id
(also 'sitename.dom/a/link?l=%link_id%')

USER PAGES
'sitename.dom/u/*' - for user area reserved
'sitename.dom/u/login' -
'sitename.dom/u/logout' -
'sitename.dom/u/info' -

REDIRECTION PAGES
'sitename.dom/%link%' where
  %link%       ::= %link-first%%link-tail%
  %link-first% ::= B-TV-Zb-tv-z0-9    - except starting "a" and "u"
  %link-tail%  ::= (A-Za-z0-9\-){4,}  -

