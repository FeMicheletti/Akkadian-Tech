namespace ClinicaAPI.Models {
    public class Scheduling {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? DoctorId { get; set; }
        public string? Description { get; set; }
        public DateTime? Date { get; set; }
    }
}