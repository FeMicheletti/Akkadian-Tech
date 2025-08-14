using Microsoft.EntityFrameworkCore;
using ClinicaAPI.Models;

namespace ClinicaAPI.Data {
    public class AppDbContext : DbContext {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Scheduling> Schedulings { get; set; }
    }
}