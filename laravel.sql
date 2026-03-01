-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2026 at 09:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laravel`
--

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'Swimming pool', NULL, '2026-03-01 09:39:43', '2026-03-01 09:39:43');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_date` datetime NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('pending','contacted','closed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `agent_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `property_id`, `user_id`, `name`, `email`, `phone`, `message`, `status`, `created_at`, `updated_at`, `agent_id`) VALUES
(1, 1, NULL, 'Tendo phillip', 'tendophillip11@gmail.com', '+256759160763', 'I am inteAm just inquiryingrested in Acacia mall kampala. Please provide more details.', 'pending', '2026-02-28 10:36:25', '2026-02-28 10:36:25', NULL),
(2, NULL, NULL, 'kavuma Dennis', 'kavumadennis11@gmail.com', '0759160763', 'dbbbbgggggggggggggggg', 'pending', '2026-02-28 17:13:31', '2026-02-28 17:13:31', 4);

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `slug`, `parent_id`, `type`, `created_at`, `updated_at`) VALUES
(1, 'Kampala', 'kampala', NULL, 'city', '2026-02-22 16:57:08', '2026-02-22 16:57:08'),
(2, 'Entebbe', 'entebbe', NULL, 'city', '2026-02-22 16:57:08', '2026-02-22 16:57:08'),
(3, 'Wakiso', 'wakiso', NULL, 'district', '2026-02-22 16:57:08', '2026-02-22 16:57:08'),
(4, 'Kira', 'kira', NULL, 'municipality', '2026-02-22 16:57:08', '2026-02-22 16:57:08'),
(5, 'Mukono', 'mukono', NULL, 'municipality', '2026-02-22 16:57:09', '2026-02-22 16:57:09'),
(6, 'Mbarara', 'mbarara', NULL, 'city', '2026-02-22 16:57:09', '2026-02-22 16:57:09'),
(7, 'Jinja', 'jinja', NULL, 'city', '2026-02-22 16:57:09', '2026-02-22 16:57:09');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_02_22_132257_create_roles_table', 1),
(6, '2026_02_22_132258_add_role_id_to_users_table', 1),
(7, '2026_02_22_132258_create_amenities_table', 1),
(8, '2026_02_22_132258_create_locations_table', 1),
(9, '2026_02_22_132258_create_properties_table', 1),
(10, '2026_02_22_132259_create_property_amenity_table', 1),
(11, '2026_02_22_132259_create_property_documents_table', 1),
(12, '2026_02_22_132259_create_property_images_table', 1),
(13, '2026_02_22_132300_create_appointments_table', 1),
(14, '2026_02_22_132300_create_inquiries_table', 1),
(15, '2026_02_22_132300_create_reviews_table', 1),
(16, '2026_02_22_132300_create_saved_properties_table', 1),
(17, '2026_02_22_190236_create_post_categories_table', 2),
(18, '2026_02_22_190240_create_posts_table', 2),
(19, '2026_02_22_204012_add_profile_fields_to_users_table', 3),
(20, '2026_02_22_214741_add_extra_fields_to_properties_table', 4),
(21, '2026_02_22_215342_create_pages_table', 5),
(22, '2026_02_22_215342_create_settings_table', 5),
(23, '2026_02_22_215343_create_transactions_table', 5),
(24, '2026_02_27_224426_create_categories_table', 6),
(25, '2026_02_28_125439_create_property_views_table', 7),
(26, '2026_02_28_014600_create_categories_table', 8),
(27, '2026_02_28_161318_add_agent_id_to_reviews_table', 8),
(28, '2026_02_28_163931_add_agent_id_to_inquiries_table', 9),
(29, '2026_02_28_213832_add_is_verified_to_users_table', 10),
(30, '2026_03_01_130232_create_saved_posts_table', 11);

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `title`, `slug`, `content`, `meta_title`, `meta_description`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 'Terms and conditions', 'terms-and-conditions', 'Bluhhhhhhhhhhhhhhhhhhhhhhhh', 'T & C', NULL, 1, '2026-03-01 09:28:49', '2026-03-01 09:28:49');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 4, 'auth_token', '7f2414fc85058354f7f5a8b73d8c6ab6de511a2eb685fc828bd9e2b0f86da99e', '[\"*\"]', '2026-02-22 16:24:52', NULL, '2026-02-22 14:31:39', '2026-02-22 16:24:52'),
(2, 'App\\Models\\User', 4, 'auth_token', 'e3e5fef44d6733f2fd0c81217f134e7b0f47965be81246936a2bf6ea8fa57719', '[\"*\"]', '2026-02-22 17:16:55', NULL, '2026-02-22 16:28:41', '2026-02-22 17:16:55'),
(3, 'App\\Models\\User', 4, 'auth_token', '246fc0b624d64f06a44a1812241c34e9bff2e0db1a3ad691734194012e3b12fa', '[\"*\"]', '2026-02-22 17:25:24', NULL, '2026-02-22 17:24:43', '2026-02-22 17:25:24'),
(4, 'App\\Models\\User', 4, 'auth_token', 'f6b226c1fbc43c0b598b9559cf22e487feb6dd7bac97bd0938ddc701c6d60c41', '[\"*\"]', '2026-02-22 17:26:27', NULL, '2026-02-22 17:25:33', '2026-02-22 17:26:27'),
(5, 'App\\Models\\User', 4, 'auth_token', 'debd916eaa430c493e1224b3d297fda6d0995814c60e8d6e4a1230c353112788', '[\"*\"]', '2026-02-22 17:41:51', NULL, '2026-02-22 17:26:45', '2026-02-22 17:41:51'),
(6, 'App\\Models\\User', 5, 'auth_token', 'c3897fc373585ed438412e4cad2b6d03c00164832687806ebab66d7cf64b9d29', '[\"*\"]', '2026-02-22 17:56:15', NULL, '2026-02-22 17:55:47', '2026-02-22 17:56:15'),
(7, 'App\\Models\\User', 4, 'auth_token', '5c72a9e03291e5c9d826b46ff0f6c44b73eca2afebdc8c2248331891f8404293', '[\"*\"]', '2026-02-23 10:56:47', NULL, '2026-02-22 18:24:47', '2026-02-23 10:56:47'),
(8, 'App\\Models\\User', 4, 'auth_token', 'c7d2131fb0e2779fc4763e21e09bff2185e9e1c6e014a61a874637c95d82e0c0', '[\"*\"]', '2026-02-25 13:53:46', NULL, '2026-02-25 11:06:27', '2026-02-25 13:53:46'),
(9, 'App\\Models\\User', 4, 'auth_token', '5df72d210ad6a189b7988436fee65727cc9c4b2bd76ec5bf7290c14895b30582', '[\"*\"]', '2026-02-27 17:56:18', NULL, '2026-02-25 15:43:19', '2026-02-27 17:56:18'),
(10, 'App\\Models\\User', 4, 'auth_token', 'aa49a9dff94eec1023a59c9f1232fa91681dd047737d433b90dfd7d46bf62b14', '[\"*\"]', '2026-02-27 19:34:19', NULL, '2026-02-27 18:00:11', '2026-02-27 19:34:19'),
(11, 'App\\Models\\User', 5, 'auth_token', 'abb78e87b54877d33a4c2501c81477255c1bf816a1612d9bde15564c7fd74e99', '[\"*\"]', NULL, NULL, '2026-02-27 19:54:36', '2026-02-27 19:54:36'),
(12, 'App\\Models\\User', 4, 'auth_token', 'c2fd7a264d2b05a4b1c4bf363d4c28cd4d0b5dea3c86f65cf3ec431df088c090', '[\"*\"]', '2026-02-28 10:07:19', NULL, '2026-02-27 19:54:55', '2026-02-28 10:07:19'),
(13, 'App\\Models\\User', 6, 'auth_token', 'db0586ef1def0ad0f17dd7a01a3a30392de0cc1be3f6c13ee1571bb4354db044', '[\"*\"]', '2026-02-28 10:37:00', NULL, '2026-02-28 10:14:18', '2026-02-28 10:37:00'),
(14, 'App\\Models\\User', 4, 'auth_token', 'fec4a5b4bb68120b985cf98dde31beeefa77dceba762a013b7ebaa8ee249a655', '[\"*\"]', '2026-02-28 18:56:24', NULL, '2026-02-28 10:37:22', '2026-02-28 18:56:24'),
(15, 'App\\Models\\User', 6, 'auth_token', '64284a1ea2d98334d0d07d01228246fc53715ec47c8783736c7cc2f897e26b8f', '[\"*\"]', '2026-02-28 18:25:00', NULL, '2026-02-28 10:47:41', '2026-02-28 18:25:00'),
(16, 'App\\Models\\User', 4, 'google_token', '6d59acc58abdf0d92a0442fbce270af71d4883dbde5c49a931d36a46a651c01a', '[\"*\"]', '2026-02-28 19:27:13', NULL, '2026-02-28 19:27:09', '2026-02-28 19:27:13'),
(17, 'App\\Models\\User', 4, 'google_token', 'b6f469bba3cf961f8d0dce12d5b63f0bf5c7d60f8bc21e2e13f9dcfd2bf21027', '[\"*\"]', '2026-02-28 19:33:15', NULL, '2026-02-28 19:27:19', '2026-02-28 19:33:15'),
(18, 'App\\Models\\User', 4, 'google_token', 'c805dd2c295edfec8f2d068d8d9e30b4230777159809e4c28f85ade4029bd16a', '[\"*\"]', '2026-03-01 09:40:02', NULL, '2026-02-28 19:34:12', '2026-03-01 09:40:02'),
(19, 'App\\Models\\User', 4, 'google_token', '8bce9e15a9c9d633bc158d74134fd386d5b3cd925f56340d9d21f3752c8422e4', '[\"*\"]', '2026-03-01 10:17:55', NULL, '2026-03-01 10:13:28', '2026-03-01 10:17:55'),
(20, 'App\\Models\\User', 7, 'google_token', '6dc4c305852cb638fd637e64c2458be9407c215edd80af62c7a2508be65368d7', '[\"*\"]', '2026-03-01 10:20:46', NULL, '2026-03-01 10:14:34', '2026-03-01 10:20:46'),
(21, 'App\\Models\\User', 4, 'google_token', 'ff8b8c61b10cfe3cdccd50908655cef25eb63acb0a67a8179977776be90a1194', '[\"*\"]', '2026-03-01 10:25:59', NULL, '2026-03-01 10:18:09', '2026-03-01 10:25:59'),
(22, 'App\\Models\\User', 7, 'google_token', 'c69f41c39bfee1dc6bf7a853a55fb1ce16bd6358402fc0c8045623bfd4e8d6e3', '[\"*\"]', '2026-03-01 11:29:16', NULL, '2026-03-01 10:21:47', '2026-03-01 11:29:16'),
(23, 'App\\Models\\User', 4, 'auth_token', 'dbda4b87f0a04a954086afca40d290ce0c1afcc977a589a376f2ddbf3bdb701b', '[\"*\"]', '2026-03-01 10:40:14', NULL, '2026-03-01 10:26:07', '2026-03-01 10:40:14'),
(24, 'App\\Models\\User', 4, 'google_token', '4de1d4853e2fcb48a24c364a92c79cbc5fffc1203e13dbbae800aa4136078e36', '[\"*\"]', '2026-03-01 10:55:27', NULL, '2026-03-01 10:45:44', '2026-03-01 10:55:27'),
(25, 'App\\Models\\User', 6, 'auth_token', '896df0b04e7df446250d0408189663228f93493d1d44757758305c18e4ee08d2', '[\"*\"]', '2026-03-01 11:04:17', NULL, '2026-03-01 10:57:27', '2026-03-01 11:04:17'),
(26, 'App\\Models\\User', 4, 'google_token', 'd92ca4b64820c8b09ef9ebe0e43fa707805a3ec5d7f3d2ecf950367de6af629c', '[\"*\"]', '2026-03-01 14:31:42', NULL, '2026-03-01 11:04:23', '2026-03-01 14:31:42'),
(27, 'App\\Models\\User', 4, 'google_token', 'b47ccb3b633908eb772d94535c65949dd3439c135458feddbab1a88a2fcbe44b', '[\"*\"]', '2026-03-01 17:18:48', NULL, '2026-03-01 16:34:29', '2026-03-01 17:18:48');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `author_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('published','draft') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `slug`, `excerpt`, `content`, `featured_image`, `category_id`, `author_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Top 10 Real Estate Trends to Watch in 2026', 'top-10-real-estate-trends', 'Discover the key trends shaping the property market this year, from sustainable living to AI-driven valuations.', 'The real estate market is evolving faster than ever. In this comprehensive guide, we explore how sustainable building practices are becoming the gold standard, and why AI-driven technology is revolutionizing how we find and value properties. Whether you are a first-time buyer or a seasoned investor, staying ahead of these trends is crucial for success.', 'posts/Z1bIkDreB5tYRW2IbVqujxu8v3v8yjTK5bEZK1kU.jpg', 1, 1, 'published', '2026-02-22 16:10:12', '2026-02-28 17:08:35'),
(2, 'The Ultimate Guide to Modern Minimalist Interiors', 'modern-minimalist-interiors', 'Learn how to transform your home into a serene, minimalist sanctuary without losing comfort.', 'Minimalism is not about having nothing, it\'s about having exactly what you need. In this article, our design experts share their secrets for choosing the right color palettes, lighting, and statement pieces to create a high-end minimalist look that feels warm and welcoming. We cover everything from open-concept living to smart storage solutions.', 'posts/pXWLFM55Z4jsuvKx637CdRZjSK1meLppc6YQTw5d.jpg', 3, 1, 'published', '2026-02-22 16:10:12', '2026-02-28 17:09:20'),
(4, 'Knight Frank wins Large Property Agency of the Year at the Property Awards 2024', 'knight-frank-wins-large-property-agency-of-the-year-at-the-property-awards-2024-THPt', 'Knight Frank wins Large Property Agency of the Year at the Property Awards 2024', 'Our commitment to fostering an inclusive and diverse workplace\r\nOur dedication to diversity and inclusion is illustrated by two significant hires in 2023. Hannah Awonuga joined us from Barclays as Partner and Group Head of Diversity and Inclusion, bringing her extensive experience in driving performance and introducing best practices. Karen Bowes, our Chief People Officer and Proprietary Partner, joined with a wealth of knowledge from the legal and financial services sectors, and she is leading our people strategy with a focus on inclusivity.\r\n\r\nWe were pleased to host Diverse Voices, a forum focusing on diversity in property, held by Property Week. During this discussion, Stephen Clifton, Head of Commercial, highlighted the importance of data as a key feature of how we’re building a more diverse culture and working environment. “You can see the difference we are making, and you can measure that.”\r\n\r\nHannah Awonuga built on this point, adding, “The way you can be clear about your direction is knowing what the data is.” We’re looking forward to many more DEI milestones and continuing to impact the industry positively.', 'posts/OHsskDuIvohLXOjmw6BKtzFijiXTPhq3oNAl5HuS.jpg', 1, 4, 'published', '2026-02-28 10:54:19', '2026-02-28 10:54:19');

-- --------------------------------------------------------

--
-- Table structure for table `post_categories`
--

CREATE TABLE `post_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_categories`
--

INSERT INTO `post_categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Market Trends', 'market-trends', 'Latest updates in the real estate market.', '2026-02-22 16:10:12', '2026-02-22 16:10:12'),
(2, 'Home Buying Tips', 'home-buying-tips', 'Advice for first-time home buyers.', '2026-02-22 16:10:12', '2026-02-22 16:10:12'),
(3, 'Interior Design', 'interior-design', 'Inspiration for your home\'s interior.', '2026-02-22 16:10:12', '2026-02-22 16:10:12');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `virtual_tour_url` varchar(255) DEFAULT NULL,
  `type` enum('house','apartment','commercial','land') NOT NULL,
  `status` enum('for_sale','for_rent') NOT NULL,
  `availability` enum('available','sold','reserved','off_market') NOT NULL DEFAULT 'available',
  `price` decimal(15,2) NOT NULL,
  `address` varchar(255) NOT NULL,
  `location_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `agent_id` bigint(20) UNSIGNED NOT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `size` decimal(10,2) DEFAULT NULL,
  `land_size` decimal(10,2) DEFAULT NULL,
  `land_size_unit` varchar(255) NOT NULL DEFAULT 'sqm',
  `zoning` varchar(255) DEFAULT NULL,
  `topography` varchar(255) DEFAULT NULL,
  `access_road` varchar(255) DEFAULT NULL,
  `title_type` varchar(255) DEFAULT NULL,
  `price_per_sqm` decimal(15,2) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `views_count` int(11) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `title`, `slug`, `description`, `virtual_tour_url`, `type`, `status`, `availability`, `price`, `address`, `location_id`, `category_id`, `agent_id`, `bedrooms`, `bathrooms`, `size`, `land_size`, `land_size_unit`, `zoning`, `topography`, `access_road`, `title_type`, `price_per_sqm`, `latitude`, `longitude`, `is_featured`, `views_count`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 'Acacia mall kampala', 'acacia-mall-kampala-nTX1T', 'Acacia Mall stands at the centre of Kisementi, a Kampala suburb. It is located along Sturrock road and well connected to four other roads that is, John Babiha (Acacia) Avenue, Cooper road and Bukoto Street and Kira road.', NULL, 'commercial', 'for_rent', 'available', 5000004.00, 'Kisementi, a Kampala suburb', 1, NULL, 4, NULL, NULL, 12000.00, NULL, 'sqm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 33, 0, '2026-02-22 17:03:14', '2026-03-01 08:56:41'),
(2, 'Acacia mall Kampala', 'acacia-mall-kampala-sPRjy', 'Acacia Mall stands at the centre of Kisementi, a Kampala suburb. It is located along Sturrock road and well connected to four other roads that is, John Babiha (Acacia) Avenue, Cooper road and Bukoto Street and Kira road.', NULL, 'house', 'for_rent', 'available', 500000.00, 'Kisementi, a Kampala suburb', 1, NULL, 4, NULL, NULL, 12000.00, NULL, 'sqm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 69, 0, '2026-02-22 17:12:33', '2026-03-01 16:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `property_amenity`
--

CREATE TABLE `property_amenity` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `amenity_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_documents`
--

CREATE TABLE `property_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `document_path` varchar(255) NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_images`
--

INSERT INTO `property_images` (`id`, `property_id`, `image_path`, `is_main`, `created_at`, `updated_at`) VALUES
(1, 1, 'properties/CyFPYsC9G9a7h3DrOO6q3gGuH3ChqHBfqwlSU2Nc.jpg', 0, '2026-02-22 17:03:15', '2026-02-22 17:03:15'),
(2, 1, 'properties/iiH1xPTPAxt4PZLNXVhGPbsURqir5OpdC5IfMH3a.jpg', 0, '2026-02-22 17:03:15', '2026-02-22 17:03:15'),
(3, 2, 'properties/3s1Nd5J0IHp1Jzy9gtwOSwGKzfhiOwbPUAOTthkn.jpg', 0, '2026-02-22 17:12:33', '2026-02-22 17:12:33'),
(4, 2, 'properties/gyGWz4ydAP9eTx1DaSnZmugvGadK6a2ixXRskpzq.jpg', 0, '2026-02-22 17:12:33', '2026-02-22 17:12:33');

-- --------------------------------------------------------

--
-- Table structure for table `property_views`
--

CREATE TABLE `property_views` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_views`
--

INSERT INTO `property_views` (`id`, `property_id`, `user_id`, `ip_address`, `created_at`, `updated_at`) VALUES
(1, 2, NULL, '127.0.0.1', '2026-02-28 10:15:48', '2026-02-28 10:15:48'),
(2, 2, NULL, '127.0.0.1', '2026-02-28 10:15:48', '2026-02-28 10:15:48'),
(3, 2, NULL, '127.0.0.1', '2026-02-28 10:27:50', '2026-02-28 10:27:50'),
(4, 2, NULL, '127.0.0.1', '2026-02-28 10:27:50', '2026-02-28 10:27:50'),
(5, 1, NULL, '127.0.0.1', '2026-02-28 10:29:23', '2026-02-28 10:29:23'),
(6, 1, NULL, '127.0.0.1', '2026-02-28 10:29:24', '2026-02-28 10:29:24'),
(7, 2, NULL, '127.0.0.1', '2026-02-28 10:32:33', '2026-02-28 10:32:33'),
(8, 2, NULL, '127.0.0.1', '2026-02-28 10:32:34', '2026-02-28 10:32:34'),
(9, 1, NULL, '127.0.0.1', '2026-02-28 10:33:04', '2026-02-28 10:33:04'),
(10, 1, NULL, '127.0.0.1', '2026-02-28 10:33:05', '2026-02-28 10:33:05'),
(11, 2, NULL, '127.0.0.1', '2026-02-28 10:33:28', '2026-02-28 10:33:28'),
(12, 2, NULL, '127.0.0.1', '2026-02-28 10:33:29', '2026-02-28 10:33:29'),
(13, 1, NULL, '127.0.0.1', '2026-02-28 10:34:24', '2026-02-28 10:34:24'),
(14, 1, NULL, '127.0.0.1', '2026-02-28 10:34:25', '2026-02-28 10:34:25'),
(15, 1, NULL, '127.0.0.1', '2026-02-28 10:34:45', '2026-02-28 10:34:45'),
(16, 1, NULL, '127.0.0.1', '2026-02-28 10:34:45', '2026-02-28 10:34:45'),
(17, 2, NULL, '127.0.0.1', '2026-02-28 11:02:48', '2026-02-28 11:02:48'),
(18, 2, NULL, '127.0.0.1', '2026-02-28 11:02:49', '2026-02-28 11:02:49'),
(19, 2, NULL, '127.0.0.1', '2026-02-28 11:06:08', '2026-02-28 11:06:08'),
(20, 2, NULL, '127.0.0.1', '2026-02-28 13:23:50', '2026-02-28 13:23:50'),
(21, 2, NULL, '127.0.0.1', '2026-02-28 13:23:51', '2026-02-28 13:23:51'),
(22, 2, NULL, '127.0.0.1', '2026-02-28 13:23:57', '2026-02-28 13:23:57'),
(23, 2, NULL, '127.0.0.1', '2026-02-28 13:23:59', '2026-02-28 13:23:59'),
(24, 1, NULL, '127.0.0.1', '2026-02-28 17:14:14', '2026-02-28 17:14:14'),
(25, 1, NULL, '127.0.0.1', '2026-02-28 17:14:14', '2026-02-28 17:14:14'),
(26, 1, NULL, '127.0.0.1', '2026-02-28 17:15:10', '2026-02-28 17:15:10'),
(27, 2, NULL, '127.0.0.1', '2026-02-28 17:20:56', '2026-02-28 17:20:56'),
(28, 2, NULL, '127.0.0.1', '2026-02-28 17:20:57', '2026-02-28 17:20:57'),
(29, 2, NULL, '127.0.0.1', '2026-02-28 18:29:48', '2026-02-28 18:29:48'),
(30, 2, NULL, '127.0.0.1', '2026-02-28 18:29:49', '2026-02-28 18:29:49'),
(31, 2, NULL, '127.0.0.1', '2026-02-28 18:55:22', '2026-02-28 18:55:22'),
(32, 2, NULL, '127.0.0.1', '2026-02-28 18:55:22', '2026-02-28 18:55:22'),
(33, 2, NULL, '127.0.0.1', '2026-02-28 18:56:13', '2026-02-28 18:56:13'),
(34, 2, NULL, '127.0.0.1', '2026-02-28 18:56:13', '2026-02-28 18:56:13'),
(35, 2, NULL, '127.0.0.1', '2026-02-28 19:40:03', '2026-02-28 19:40:03'),
(36, 2, NULL, '127.0.0.1', '2026-02-28 19:40:03', '2026-02-28 19:40:03'),
(37, 1, NULL, '127.0.0.1', '2026-03-01 08:56:40', '2026-03-01 08:56:40'),
(38, 1, NULL, '127.0.0.1', '2026-03-01 08:56:41', '2026-03-01 08:56:41'),
(39, 2, NULL, '127.0.0.1', '2026-03-01 10:02:04', '2026-03-01 10:02:04'),
(40, 2, NULL, '127.0.0.1', '2026-03-01 10:02:04', '2026-03-01 10:02:04'),
(41, 2, NULL, '127.0.0.1', '2026-03-01 16:51:20', '2026-03-01 16:51:20'),
(42, 2, NULL, '127.0.0.1', '2026-03-01 16:51:21', '2026-03-01 16:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` int(10) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `agent_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `property_id`, `rating`, `comment`, `is_approved`, `created_at`, `updated_at`, `agent_id`) VALUES
(1, 4, NULL, 4, 'tttttttttttttttttt', 1, '2026-02-28 13:26:44', '2026-02-28 13:26:44', 4),
(2, 6, NULL, 4, 'hhhhhhhhhhhhhhhhhhhhh', 1, '2026-02-28 13:31:47', '2026-02-28 13:31:47', 4),
(3, 6, NULL, 4, 'gf', 0, '2026-02-28 13:43:30', '2026-02-28 16:59:01', 4),
(4, 4, 1, 4, 'State of the art property', 1, '2026-02-28 17:15:09', '2026-02-28 17:15:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'super-admin', '2026-02-22 10:43:18', '2026-02-22 10:43:18'),
(2, 'Admin', 'admin', '2026-02-22 10:43:18', '2026-02-22 10:43:18'),
(3, 'Agent', 'agent', '2026-02-22 10:43:18', '2026-02-22 10:43:18'),
(4, 'User', 'user', '2026-02-22 10:43:18', '2026-02-22 10:43:18');

-- --------------------------------------------------------

--
-- Table structure for table `saved_posts`
--

CREATE TABLE `saved_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `saved_posts`
--

INSERT INTO `saved_posts` (`id`, `user_id`, `post_id`, `created_at`, `updated_at`) VALUES
(1, 4, 1, '2026-03-01 10:15:27', '2026-03-01 10:15:27');

-- --------------------------------------------------------

--
-- Table structure for table `saved_properties`
--

CREATE TABLE `saved_properties` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `saved_properties`
--

INSERT INTO `saved_properties` (`id`, `user_id`, `property_id`, `created_at`, `updated_at`) VALUES
(1, 4, 1, '2026-03-01 10:17:18', '2026-03-01 10:17:18');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `group` varchar(255) NOT NULL DEFAULT 'general',
  `type` varchar(255) NOT NULL DEFAULT 'text',
  `label` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `avatar`, `bio`, `phone`, `specialization`, `email_verified_at`, `password`, `is_verified`, `verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 2, 'Admin User', 'admin@example.com', NULL, NULL, NULL, NULL, NULL, '$2y$10$EG9dtL0jmc95Qz.bcs..e.3yd1v4PYIksCkpE3pbggzjaTNx84.ku', 0, NULL, NULL, '2026-02-22 10:43:18', '2026-02-22 10:43:18'),
(2, 3, 'Agent User', 'agent@example.com', NULL, NULL, NULL, NULL, NULL, '$2y$10$Bm4pmqAkpExlyCEuY8EbGenr2BRqAFm4iAm3/fgUGsdQ3hA2mXhVu', 1, '2026-03-01 11:33:31', NULL, '2026-02-22 10:43:18', '2026-03-01 11:33:31'),
(3, 4, 'Normal User', 'user@example.com', NULL, NULL, NULL, NULL, NULL, '$2y$10$wr0axJO.v25rFzd9v5B4fOpvA9kgeNOH5f9rVmwSnAPQ2p0Q.TJc6', 0, NULL, NULL, '2026-02-22 10:43:18', '2026-02-22 10:43:18'),
(4, 1, 'kavuma dennis', 'kavumadennis11@gmail.com', 'avatars/ZmdMpMWg2WcrGEixVuJKNYTkszU00YtHvoGvhzRl.jpg', NULL, NULL, NULL, NULL, '$2y$10$QJfc1uOrvMiRy/MCCaWxl..6UctMrtuqaPm6dMFGEdbYRE.HmWgT6', 0, NULL, NULL, '2026-02-22 14:31:39', '2026-03-01 08:25:16'),
(6, 2, 'Moses King', 'mosesking@gmail.com', NULL, NULL, NULL, NULL, NULL, '$2y$10$lz9X7Q6mJ979XcLvkg9Yh.Azqxxg2sfYd8Kr0iphQOORgsgzXSviy', 1, '2026-03-01 09:14:32', NULL, '2026-02-28 10:14:18', '2026-03-01 09:14:32'),
(7, 3, 'Tendo Phillip', 'tendophillip19@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocICwJxsqRlNGRrEkUN6Ik1dGFJyGZRDQkejw7ltGBJsVElhIg=s96-c', NULL, NULL, NULL, NULL, '$2y$10$/F81acjmUEhfseP7oe6XYezTTXkvtmgBLTFmKfGqOJwoYQrweVoue', 1, NULL, NULL, '2026-03-01 10:14:34', '2026-03-01 10:14:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_property_id_foreign` (`property_id`),
  ADD KEY `appointments_user_id_foreign` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inquiries_property_id_foreign` (`property_id`),
  ADD KEY `inquiries_user_id_foreign` (`user_id`),
  ADD KEY `inquiries_agent_id_foreign` (`agent_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `locations_slug_unique` (`slug`),
  ADD KEY `locations_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pages_slug_unique` (`slug`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `posts_slug_unique` (`slug`),
  ADD KEY `posts_category_id_foreign` (`category_id`),
  ADD KEY `posts_author_id_foreign` (`author_id`);

--
-- Indexes for table `post_categories`
--
ALTER TABLE `post_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_categories_slug_unique` (`slug`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `properties_slug_unique` (`slug`),
  ADD KEY `properties_location_id_foreign` (`location_id`),
  ADD KEY `properties_agent_id_foreign` (`agent_id`),
  ADD KEY `properties_category_id_foreign` (`category_id`);

--
-- Indexes for table `property_amenity`
--
ALTER TABLE `property_amenity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_amenity_property_id_foreign` (`property_id`),
  ADD KEY `property_amenity_amenity_id_foreign` (`amenity_id`);

--
-- Indexes for table `property_documents`
--
ALTER TABLE `property_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_documents_property_id_foreign` (`property_id`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_images_property_id_foreign` (`property_id`);

--
-- Indexes for table `property_views`
--
ALTER TABLE `property_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_views_property_id_foreign` (`property_id`),
  ADD KEY `property_views_user_id_foreign` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`),
  ADD KEY `reviews_property_id_foreign` (`property_id`),
  ADD KEY `reviews_agent_id_foreign` (`agent_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`),
  ADD UNIQUE KEY `roles_slug_unique` (`slug`);

--
-- Indexes for table `saved_posts`
--
ALTER TABLE `saved_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `saved_posts_user_id_post_id_unique` (`user_id`,`post_id`),
  ADD KEY `saved_posts_post_id_foreign` (`post_id`);

--
-- Indexes for table `saved_properties`
--
ALTER TABLE `saved_properties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `saved_properties_user_id_property_id_unique` (`user_id`,`property_id`),
  ADD KEY `saved_properties_property_id_foreign` (`property_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactions_transaction_id_unique` (`transaction_id`),
  ADD KEY `transactions_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `post_categories`
--
ALTER TABLE `post_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `property_amenity`
--
ALTER TABLE `property_amenity`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_documents`
--
ALTER TABLE `property_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `property_views`
--
ALTER TABLE `property_views`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `saved_posts`
--
ALTER TABLE `saved_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `saved_properties`
--
ALTER TABLE `saved_properties`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD CONSTRAINT `inquiries_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inquiries_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inquiries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `locations_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `posts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `post_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `properties_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `properties_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_amenity`
--
ALTER TABLE `property_amenity`
  ADD CONSTRAINT `property_amenity_amenity_id_foreign` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_amenity_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_documents`
--
ALTER TABLE `property_documents`
  ADD CONSTRAINT `property_documents_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_views`
--
ALTER TABLE `property_views`
  ADD CONSTRAINT `property_views_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_views_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_posts`
--
ALTER TABLE `saved_posts`
  ADD CONSTRAINT `saved_posts_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `saved_posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_properties`
--
ALTER TABLE `saved_properties`
  ADD CONSTRAINT `saved_properties_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `saved_properties_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
