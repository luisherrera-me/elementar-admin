import { Component } from '@angular/core';
import { DashboardComponent, Widget, WidgetConfig } from '@elementar/components/dashboard';

@Component({
  selector: 'app-explore',
  imports: [
    DashboardComponent
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent {
  configs: WidgetConfig[] = [
    {
      type: 'explore-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/explore-widget/explore-widget.component').then(c => c.ExploreWidgetComponent)
    },
    {
      type: 'heading-widget',
      skeleton: null,
      plain: true,
      component: () =>
        import('@elementar/store/widgets/heading-widget/heading-widget.component').then(c => c.HeadingWidgetComponent)
    },
    {
      type: 'action-required-widget',
      skeleton: null,
      plain: true,
      component: () =>
        import('@elementar/store/widgets/action-required-widget/action-required-widget.component').then(c => c.ActionRequiredWidgetComponent)
    },
    {
      type: 'article-snippet-widget',
      skeleton: null,
      component: () =>
        import('@elementar/store/widgets/article-snippet-widget/article-snippet-widget.component').then(c => c.ArticleSnippetWidgetComponent)
    },
  ];
  widgets: Widget[] = [
    {
      id: 20,
      type: 'action-required-widget',
      columns: 12,
      data: 12.90,
      description: 'Please provide your company details to access our services seamlessly, whether forming a new company or adding existing information.',
      buttonText: 'Fix the problem',
    },
    {
      id: 1,
      type: 'explore-widget',
      columns: 4,
      iconName: 'hub',
      title: 'Community',
      data: 12.90,
      description: 'Connect with other Makers, exchange ideas and tips.',
    },
    {
      id: 2,
      type: 'explore-widget',
      columns: 4,
      iconName: 'school',
      title: 'Academy',
      data: 12.90,
      description: 'Level up your developer skills.',
    },
    {
      id: 3,
      type: 'explore-widget',
      columns: 4,
      iconName: 'question_mark',
      title: 'Help Center',
      data: 12.90,
      description: 'Explore our detailed documentation.',
    },
    {
      id: 4,
      type: 'explore-widget',
      columns: 4,
      iconName: 'group',
      title: 'Mentor Directory',
      data: 12.90,
      description: 'Find the perfect mentor to support your business.',
    },
    {
      id: 4,
      type: 'explore-widget',
      columns: 4,
      iconName: 'menu_book',
      title: 'Blog',
      data: 12.90,
      description: 'Access popular guides & stories about automation.',
    },
    {
      id: 5,
      type: 'explore-widget',
      columns: 4,
      iconName: 'leaderboard',
      title: 'Use Cases',
      data: 12.90,
      description: 'Get inspired by all the ways you can automate.',
    },
    {
      id: 6,
      type: 'heading-widget',
      columns: 12,
      title: 'Blog articles',
      data: 12.90,
      viewMore: {
        name: 'Browse all',
        link: '/pages/content/posts/list',
      }
    },
    {
      id: 7,
      type: 'article-snippet-widget',
      columns: 4,
      data: 12.90,
      title: 'The Must-Have SEO Checklist for Developers For 2025',
      imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
      publishedAt: new Date(),
    },
    {
      id: 8,
      type: 'article-snippet-widget',
      columns: 4,
      data: 12.90,
      title: 'Build a Distributed Task Scheduler Using RabbitMQ and Redis',
      imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
      publishedAt: new Date(),
    },
    {
      id: 9,
      type: 'article-snippet-widget',
      columns: 4,
      data: 12.90,
      title: 'How to retrieve values from all types of HTML Inputs in JavaScript',
      imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
      publishedAt: new Date(),
    },
    {
      id: 10,
      type: 'article-snippet-widget',
      columns: 4,
      data: 12.90,
      title: 'Mastering Async/Await and DOM Manipulation',
      imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
      publishedAt: new Date(),
    },
    {
      id: 11,
      type: 'article-snippet-widget',
      columns: 4,
      data: 12.90,
      title: '20 senior Angular developer interview questions and answers',
      imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
      publishedAt: new Date(),
    },
    {
      id: 12,
      type: 'article-snippet-widget',
      columns: 4,
      data: 12.90,
      title: 'Master clean code principles and best practices',
      imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
      publishedAt: new Date(),
    },
  ];
}
