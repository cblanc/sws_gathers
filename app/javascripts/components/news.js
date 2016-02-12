const $ = require("jquery");
const React = require("react");
const helper = require("javascripts/helper");
const storageAvailable = helper.storageAvailable;

const READ_ARTICLES_STORAGE = "akuh098h209ufnw";
const HTML_ENTITY_REGEX = /&#\d+;/;

const News = exports.News = React.createClass({
	getInitialState() {
		let readArticles = {};
		if (storageAvailable('localStorage')) {
			const raw = localStorage.getItem(READ_ARTICLES_STORAGE) || {};
			console.log(raw)
			let rawJson;
			try {
				rawJson = JSON.parse(raw);
			} catch (e) {
				rawJson = {};
			}
			readArticles = rawJson; 
		}

		return {
			posts: [],
			show: false,
			readArticles: readArticles
		};
	},

	toggleShow() {
		this.setState({ show: !this.state.show });
	},

	updatePosts(data) {
		this.setState({
			posts: data.posts.slice(0,5).map(post => {
				return {
					id: post.id,
					url: post.url,
					title: post.title
				}
			})
		});
	},

	renderTitle(title) {
		return title.replace(HTML_ENTITY_REGEX, match => {
			return String.fromCharCode(match.slice(2, match.length - 1))
		});
	},

	componentDidMount() {
		$.getJSON("http://ns2news.org/api-json/get_recent_posts?callback=?")
			.done(this.updatePosts);
	},

	markAsRead(post) {
		const self = this;
		return function (e) {
			let readArticles = self.state.readArticles;
			readArticles[post.id] = (new Date()).toJSON();
			self.setState({readArticles: readArticles});

			if (storageAvailable('localStorage')) {
				localStorage.setItem(READ_ARTICLES_STORAGE, JSON.stringify(readArticles));
			}
		}
	},

	componentClass() {
		let componentClass = ["dropdown", "messages-menu"];
		if (this.state.show) componentClass.push("open");
		return componentClass.join(" ");
	},

	hasBeenRead(post) {
		return (this.state.readArticles[post.id] !== undefined);
	},

	render() {
		const articles = this.state.posts.map(post => {
			let postClass = "";
			if (!this.hasBeenRead(post)) postClass += "unread";
			return (
				<li key={post.id}>
					<a href={post.url} target="_blank" onClick={this.markAsRead(post)}
						className={postClass}>{this.renderTitle(post.title)}</a>
				</li>
			);
		});

		const unreadArticles = this.state.posts.reduce((prev, post) => {
			if (this.hasBeenRead(post)) {
				return prev;
			} else {
				return prev + 1;
			}
		}, 0)

		let tag;
		if (unreadArticles > 0) {
			tag = <span className="label label-success">{unreadArticles}</span>;
		}

		return (
			<li className={this.componentClass()}>
			  <a href="#" onClick={this.toggleShow}>
			    <i className="fa fa-newspaper-o"></i>
			    {tag}
			  </a>
			  <ul className="dropdown-menu">
			    <li className="header">NS2 News.org</li>
				  <ul className="news-menu">
				    {articles}
				  </ul>
			  </ul>
			</li>
		);
	}
});
